import pandas as pd
import numpy as np
import geopandas as gpd

import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
    
from scipy.optimize import curve_fit
from matplotlib.cm import ScalarMappable

from ..consts import *
from .raster_data import GenerateRaster
from .adjust_horton import adjust_horton
from ..soil_texture import calculate_soil_type
from ..soil_texture import plot_soil_texture_classes


class Infiltrometro:
    total_height     = 32.7 # cm (12.9 in)
    total_diameter   =  3.1 # cm ( 1.2 in)
    disk_height      =  0.3 # cm (0.12 in)
    disk_diameter    =  4.5 # cm ( 1.8 in)
    mariotte_volume  = 40.0 # mL
    reservoir_volume = 95.0 # mL
    suction_min      =  0.5 # cm (0.2 in)
    suction_max      =  7.0 # cm (2.8 in)


    van_genuchten_parameters = pd.DataFrame({
        "soil_texture":["Sand", "Loamy Sand", "Sandy Loam", "Loam", "Silt", "Silt Loam", "Sandy Clay Loam", "Clay Loam", "Silty Clay Loam", "Sandy Clay", "Silty Clay", "Clay"],
        "alfa":        [0.145, 0.124, 0.075, 0.036, 0.016, 0.020, 0.059, 0.019, 0.010, 0.027, 0.005, 0.008],
        "n/h0":        [2.68,  2.28,  1.89,  1.56,  1.37,  1.41,  1.48,  1.31,  1.23,  1.23,  1.09,  1.09],
        "A05":         [2.84,  2.99,  3.88,  5.46,  7.92,  7.10,  3.21,  5.86,  7.89,  3.34,  6.08,  4.00],
        "A1":          [2.40,  2.79,  3.89,  5.72,  8.18,  7.37,  3.52,  6.11,  8.09,  3.57,  6.17,  4.10],
        "A2":          [1.73,  2.43,  3.91,  6.27,  8.71,  7.93,  3.24,  6.64,  8.51,  4.09,  6.36,  4.30],
        "A3":          [1.24,  2.12,  3.93,  6.87,  9.29,  8.53,  5.11,  7.23,  8.95,  4.68,  6.56,  4.51],
        "A4":          [0.89,  1.84,  3.95,  7.53,  9.90,  9.19,  6.15,  7.86,  9.41,  5.36,  6.76,  4.74],
        "A5":          [0.64,  1.61,  3.98,  8.25, 10.55,  9.89,  7.41,  8.55,  9.90,  6.14,  6.97,  4.98],
        "A6":          [0.46,  1.40,  4.00,  9.05, 11.24, 10.64,  8.92,  9.30, 10.41,  7.04,  7.18,  5.22],
    })

    def __init__(self, infiltrations:gpd.GeoDataFrame):
        self.infiltrations = infiltrations

        for column in COLUMNS_INFILTRATION:
            if column not in self.infiltrations.columns:
                raise ValueError(f"A coluna {column} não está contida no dataframe com os dados de infiltração")

        self._calculate_C1_C2()
        self._taxa_infilt()
        self._horton_params()
        self.infiltrations["Soil Type"] = calculate_soil_type(self.infiltrations["Sand"], self.infiltrations["Clay"])

    def _mask(self, point:str|None = None):
        mask = (self.infiltrations["C1"].values != None)
        mask = mask & (self.infiltrations["C2"].values != None)

        if point is not None:
            mask = mask & (self.infiltrations["Point"] == point)

        return mask

    def _calculate_C1_C2(self):
        columns_time = np.array(COLUMNS_INFILTRATION[1:22])

        times = np.array([int(i.split("_")[0])*60 + int(i.split("_")[1]) for i in columns_time])

        for ponto in self.infiltrations.itertuples():
            index = ponto.Index
            
            # Valor da infiltração nos dados do ponto para os tempos com dados
            I_data = np.array(pd.to_numeric(ponto[2:23], errors="coerce"))
            mask = ~np.isnan(I_data)

            #Deixando apenas o primeiro 0
            indices_zeros = np.where(I_data <= 0)[0]
            if len(indices_zeros) > 0:
                primeiro_zero_idx = indices_zeros[0]
                mask[primeiro_zero_idx+1:] = False

            # Substituindo os valores nulos pelos valores reais
            I_data[~mask] = I_data[mask][-1]
            for i, colum_time in enumerate(columns_time):
                self.infiltrations.at[index, colum_time] = I_data[i]

            # Caso não tenha nenhum valor de infiltração
            if not mask.any():
                continue
            
            # Valor de C1, C2 e a covariancia entre eles
            C1 = None
            index_mask = 1
            while C1 is None or C1 < 0:
                if ponto.Ponto == "P29":
                    print(mask)

                infiltrado = (I_data[mask][0]-I_data[mask])/(np.pi*np.power(self.disk_diameter/2, 2))
                C1, C2, covariance = self._aproximate_C1_C2(times[mask], infiltrado)
                
                if C1 < 0:
                    mask[index_mask] = False
                    index_mask += 1

            # Atualizando o DataFrame com os valores novos de C1, C2 e COV_C1_C2

            self.infiltrations.at[index, "C1"] = C1
            self.infiltrations.at[index, "C2"] = C2
            self.infiltrations.at[index, "COV_C1_C2"] = covariance
            
    def _taxa_infilt(self):
        columns_time = COLUMNS_INFILTRATION[1:22]

        times = np.array([int(i.split("_")[0])*60 + int(i.split("_")[1]) for i in columns_time])
        self.infiltrations["Taxa Inf"] = 0

        for ponto in self.infiltrations.itertuples():
            index = ponto.Index
            
            # Valor da infiltração nos dados do ponto para os tempos com dados
            I_data = np.array(pd.to_numeric(ponto[2:23], errors="coerce"))
            mask = ~np.isnan(I_data)

            # Substituindo os valores nulos pelos valores reais
            I_data[~mask] = I_data[mask][-1]
            for i, colum_time in enumerate(columns_time):
                self.infiltrations.at[index, colum_time] = I_data[i]

            # Caso não tenha nenhum valor de infiltração
            if not mask.any():
                continue
            
            # Valores
            infiltrado = (I_data[mask][0]-I_data[mask][-1])
            tempo = times[mask][-1]- times[mask][0]

            # Taxa de infiltração em mL/s
            self.infiltrations.at[index, "Taxa Inf"] = infiltrado/tempo

    def _aproximate_C1_C2(self, t:np.ndarray, I:np.ndarray):
        """Retorna uma tupla com os valores de C1, C2 e a covariancia entre eles."""
        
        (c1, c2), covariance = curve_fit(self._equation_infiltration, t, I)
        return c1, c2, covariance

    def _get_gradient_color(self, percent:np.ndarray, start_color:np.ndarray, end_color:np.ndarray):
        """Retorna as cores interpoladas:`array(N, (r, g, b))` entre start_color:`array(r, g, b)` e end_color:`array(r, g, b)` baseada na porcentagem:`array(N)`."""
        colors = start_color + (end_color - start_color) * percent[:, np.newaxis]
        return colors
    
    def _horton_params(self):
        columns_time = np.array(COLUMNS_INFILTRATION[1:22])

        times = (np.array([int(i.split("_")[0])*60 + int(i.split("_")[1]) for i in columns_time]))/60
        tempos = times[1:]

        area_reservoir = np.power((self.total_diameter*10E-2), 2)*np.pi/4 # Em m²

        for ponto in self.infiltrations.itertuples():
            index = ponto.Index
            
            # Valor da infiltração nos dados do ponto para os tempos com dados
            I_data = np.array(pd.to_numeric(ponto[2:23], errors="coerce"))
            mask = ~np.isnan(I_data)

            # Caso não tenha nenhum valor de infiltração
            if not mask.any():
                continue
            
            # Ajuste Horton
            I_roll = np.roll(I_data, 1)

            I_ml_30s = I_roll[1:] - I_data[1:]
            I_m3_1h = (I_ml_30s*1E-6)/(30/3600)
            I_m_1h = (I_m3_1h*1E-6)/area_reservoir
            I_cm_1h = I_m_1h * 100

            params = adjust_horton(I_cm_1h, tempos[mask[1:]], N_particulas=1000, N_iteracoes=1000)

            self.infiltrations.at[index, "H_fc"] = params['fc']
            self.infiltrations.at[index, "H_fo"] = params['fo']
            self.infiltrations.at[index, "H_k"]  = params['k']
        
        self.infiltrations.to_excel("taxa_inf.xlsx")


    def _equation_infiltration(self, t:float, C1:np.ndarray, C2:np.ndarray):
        return C1 * np.sqrt(t) + C2*t

    def _horton_equation(self, t, fc, fo, Fc):
        '''Retorna o valor da curva de infiltração pela equação de Horton para um dado valor de `fc`, `fo`, `Fc` e `t`
        Onde:

        - fc é a taxa de infiltração final (cm/h)
        - fo é a taxa de infiltração inicial (cm/h)
        - Fc é a Área sob o gráfico e maior que a reta fc
        '''
        k = (fo - fc)/Fc
        return fc+(fo-fc)*np.exp(-k*t)


    def Infiltrado(self, t:str):
        """Retorna o volume infiltrado par um t [00:00] de 0 a 10 segundos"""
        vol_init = self.infiltrations["00_00"]
        vol_fim = self.infiltrations[t.replace(":", "_")]
        vol_fim = np.where(np.isnan(vol_fim), 0, vol_fim)

        return pd.DataFrame({"Ponto": self.infiltrations["Ponto"], "Vol": (vol_init - vol_fim)})

    def K(self, point:str|None = None):
        """Retorna o dataframe com a condutividade hidráulica do solo, contém os pontos com cálculo"""

        #TODO: Verificar qual utilizar, C2 ou C1
        mask, df = self.A2(point)
        denominador = np.where(df["A2_Dohnal"].values!=None, df["A2_Dohnal"], df["A2_Zhang"])
        df["K"] = self.infiltrations[mask]["C2"]/denominador

        return df
    
    def S(self, point:str|None = None):
        """Retorna o dataframe com a sorptividade do solo, contém os pontos com cálculo"""

        mask, df = self.A1(point)
        if df is None:
            return None
        
        df["S"] = self.infiltrations[mask]["C1"]/df["A1"]

        return df

    def A1(self, point:str|None = None):
        "Retorna uma tupla com a mascara e o dataframe com o cálculo de A1 para o valor da infiltração"

        mask = self._mask(point)

        teta0 = self.infiltrations["Theta 0"].values
        tetai = self.infiltrations["Theta I"].values
        mask = mask & (teta0 != None) & (tetai != None)

        if not mask.any():
            return mask, None
        
        teta0 = self.infiltrations[mask]["Theta 0"].values
        tetai = self.infiltrations[mask]["Theta I"].values

        soils = self.van_genuchten_parameters["soil_texture"].values
        soil_types = self.infiltrations["Soil Type"][mask].values

        indexes_soil = np.array([np.where(soils == i)[0][0] for i in soil_types])

        alfa = self.van_genuchten_parameters["alfa"].values[indexes_soil]
        n  = self.van_genuchten_parameters["n/h0"].values[indexes_soil]
        h0 = self.infiltrations[mask]["Suction"].values
        r0 = self.disk_diameter/2
        b = 0.55  #(Warrick and Broadbridge, 1992)

        p1 = 1.4*np.power(b, 0.5)*np.power(teta0-tetai, 0.25)
        p2 = np.exp(3*(n-1.9)*alfa*h0)
        den = np.power(alfa*r0, 0.15)
        A1 = p1*p2/den

        return mask, pd.DataFrame({
            "Ponto": self.infiltrations[mask]["Ponto"],
            "soils_type":soil_types,
            "alfa":alfa,
            "n":n,
            "Suction":h0,
            "A1":A1,
        })

    def A2(self, point:str|None = None):
        "Retorna uma tupla com a mascara e o dataframe com o cálculo de A2 para o valor da infiltração"

        mask = self._mask(point)
        
        soils = self.van_genuchten_parameters["soil_texture"].values
        soil_types = self.infiltrations["Soil Type"][mask].values

        indexes_soil = np.array([np.where(soils == i)[0][0] for i in soil_types])

        alfa = self.van_genuchten_parameters["alfa"].values[indexes_soil]
        n  = self.van_genuchten_parameters["n/h0"].values[indexes_soil]
        h0 = self.infiltrations[mask]["Suction"].values

        p1 = 11.65*(np.power(n, 0.1)-1)
        val = np.where(n<1.9, 7.5, 2.92)
        p2 = np.exp(val*(n-1.9)*alfa*h0)
        den = np.power(alfa*(self.disk_diameter/2), 0.91)
        A_Zhang = p1*p2/den

        p1 = 11.65*(np.power(n, 0.82)-1)
        p2 = np.exp(34.65*(n-1.19)*alfa*h0)
        den = np.power(alfa*(self.disk_diameter/2), 0.6)
        vals_Dohnal = p1*p2/den
        A_Dohnal = np.where(n < 1.35, vals_Dohnal, None)

        return mask, pd.DataFrame({
            "Ponto": self.infiltrations[mask]["Ponto"],
            "soils_type":soil_types,
            "alfa":alfa,
            "n":n,
            "Suction":h0,
            "A2_Zhang":A_Zhang,
            "A2_Dohnal":A_Dohnal,
        })

    def I(self, t:float, point:str|None = None):
        """Retorna uma tupla com a mascara e o valor da infiltração para um tempo qualquer"""

        mask = self._mask(point)
        return mask, self._equation_infiltration(t, self.infiltrations[mask]["C1"], self.infiltrations[mask]["C2"])

    def dI_dt(self, t:float, point:str|None = None):
        """Retorna uma tupla com a mascara e o valor da derivada de I pelo tempo (dI/dt)"""

        mask = self._mask(point)
        return mask, (self.infiltrations[mask]["C2"]/(2*np.sqrt(t)))+self.infiltrations[mask]["C1"]

    def raster_infiltrado(
        self,
        t: str,
        mask:gpd.GeoDataFrame,
        type: str = "INVLIN",
        resolution:float = 30,
        crs = "EPSG:31983",
        max_dist_invlin: None|float = None,
        null_values:float = -1
    ):
        """Para uma maskacra e um t [00:00], que deve ser uma geometria qualquer, retorna um raster com o valor infiltrado"""
        mask = mask.to_crs(crs)
        bbox = mask.total_bounds

        raster = GenerateRaster(resolution=resolution, bbox=bbox, crs=crs)

        values = self.Infiltrado(t).Vol.values
        geometries = self.infiltrations.to_crs(crs)

        x = geometries.geometry.x
        y = geometries.geometry.y
        points = np.column_stack([x, y, values])

        mask = np.isnan(x) | np.isnan(y) | np.isnan(values)
        points = points[~mask]

        if type == "INVLIN":
            return raster.generate_invlin(points, max_dist_invlin, null_values)

        return GenerateRaster(resolution=resolution, bbox=bbox, crs=crs)

    def plot_soil_texture(self, fig:plt.Figure, ax:plt.Axes):
        ax._projection_init

        # Infiltração
        values = self.K()
        values = values["K (C1)"]

        maximo = np.ceil(np.ceil(values.max()*100)/5)*5/100
        percents = values/maximo
        percents = np.where(percents>1, 1, percents)
        percents = np.where(percents<0, 0, percents)

        # Exibir no gráfico
        colors = self._get_gradient_color(percents, np.array([1, 0.7843, 0.3569]), np.array([0.4706, 0.3137, 0]))
        sizes = 50
        border_color = [0, 0, 0]

        plot_soil_texture_classes(
            ax,
            self.infiltrations['Sand'],
            self.infiltrations['Silt'],
            self.infiltrations['Clay'],
            colors=colors,
            sizes=sizes,
            border_colors=border_color,
        )

        # Exibir o gradiente
        cmap = mcolors.LinearSegmentedColormap.from_list('meu_gradiente', [np.array([1, 0.7843, 0.3569]), np.array([0.4706, 0.3137, 0])])
        cax = fig.add_axes([0.1, 0.1, 0.01, 0.8]) # Posição e tamanho [left, bottom, width, height]
        norm = plt.Normalize(vmin=0, vmax=maximo)  # Define os valores mínimo e máximo
        sm = ScalarMappable(cmap=cmap, norm=norm)
        sm.set_array([])

        cbar = plt.colorbar(sm, cax=cax)
        cbar.set_label("Infiltração (cm/s)", fontsize=10)
        cbar.ax.tick_params(labelsize=8)

