import pandas as pd
import numpy as np

from scipy.optimize import curve_fit
from ..consts import *


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

    def __init__(self, infiltrations:pd.DataFrame):
        self.infiltrations = infiltrations

        for column in COLUMNS_INFILTRATION:
            if column not in self.infiltrations.columns:
                raise ValueError(f"A coluna {column} não está contida no dataframe com os dados de infiltração")

        self._calculate_C1_C2()

    def _mask(self, point:str|None = None):
        mask = (self.infiltrations["C1"].values != None)
        mask = mask & (self.infiltrations["C2"].values != None)

        if point is not None:
            mask = mask & (self.infiltrations["Point"] == point)

        return mask

    def _calculate_C1_C2(self):
        columns_time = COLUMNS_INFILTRATION[1:22]

        times = np.array([int(i.split(":")[0])*60 + int(i.split(":")[1]) for i in columns_time])

        for ponto in self.infiltrations.itertuples():
            index = ponto.Index
            
            # Valor da infiltração nos dados do ponto para os tempos com dados
            I_data = np.array(ponto[2:23])
            mask = ~np.isnan(I_data)

            # Caso não tenha nenhum valor de infiltração
            if not mask.any():
                continue
            
            # Valor de C1, C2 3 a covariancia entre eles
            infiltrado = (I_data[mask][0]-I_data[mask])/(np.pi*np.power(self.disk_diameter/2, 2))
            C1, C2, covariance = self._aproximate_C1_C2(times[mask], infiltrado)

            # Atualizando o DataFrame com os valores novos de C1, C2 e COV_C1_C2
            self.infiltrations.at[index, "C1"] = C1
            self.infiltrations.at[index, "C2"] = C2
            self.infiltrations.at[index, "COV_C1_C2"] = covariance

    def _aproximate_C1_C2(self, t:np.ndarray, I:np.ndarray):
        """Retorna uma tupla com os valores de C1, C2 e a covariancia entre eles."""
        
        (c1, c2), covariance = curve_fit(self._equation_infiltration, t, I)
        return c1, c2, covariance

    def _equation_infiltration(self, t, C1, C2):
        return C2 * np.sqrt(t) + C1*t

    def K(self, point:str|None = None):
        """Retorna o dataframe com a condutividade hidráulica do solo, contém os pontos com cálculo"""

        mask, df = self.A(point)
        df["K_Zhang"] = self.infiltrations[mask]["C1"]/df["A_Zhang"]
        df["K_Dohnal"] = np.where(df["A_Dohnal"].values!=None, self.infiltrations[mask]["C1"]/df["A_Dohnal"], None)

        return df
    
    def A(self, point:str|None = None):
        "Retorna uma tupla com a mascara e o dataframe com o cálculo de A para o valor da infiltração"

        mask = self._mask(point)
        
        soils = self.van_genuchten_parameters["soil_texture"].values
        soil_types = self.infiltrations["Soil Type"][mask].values

        indexes_soil = np.array([np.where(soils == i)[0][0] for i in soil_types])

        alfa = self.van_genuchten_parameters["alfa"].values[indexes_soil]
        n_h0  = self.van_genuchten_parameters["n/h0"].values[indexes_soil]
        h0 = self.infiltrations[mask]["Suction"].values

        p1 = 11.65*(np.power(n_h0, 0.1)-1)
        val = np.where(n_h0<1.9, 7.5, 2.92)
        p2 = np.exp(val*(n_h0-1.9)*alfa*h0)
        den = np.power(alfa*(self.disk_diameter/2), 0.91)
        A_Zhang = p1*p2/den

        p1 = 11.65*(np.power(n_h0, 0.82)-1)
        p2 = np.exp(34.65*(n_h0-1.19)*alfa*h0)
        den = np.power(alfa*(self.disk_diameter/2), 0.6)
        vals_Dohnal = p1*p2/den
        A_Dohnal = np.where(n_h0 < 1.35, vals_Dohnal, None)

        return mask, pd.DataFrame({
            "Ponto": self.infiltrations[mask]["Ponto"],
            "soils_type":soil_types,
            "alfa":alfa,
            "n/h0":n_h0,
            "Suction":h0,
            "A_Zhang":A_Zhang,
            "A_Dohnal":A_Dohnal,
        })

    def I(self, t:float, point:str|None = None):
        """Retorna uma tupla com a mascara e o valor da infiltração para um tempo qualquer"""

        mask = self._mask(point)
        return mask, self._equation_infiltration(t, self.infiltrations[mask]["C1"], self.infiltrations[mask]["C2"])

    def dI_dt(self, t:float, point:str|None = None):
        """Retorna uma tupla com a mascara e o valor da derivada de I pelo tempo (dI/dt)"""

        mask = self._mask(point)
        return mask, (self.infiltrations[mask]["C2"]/(2*np.sqrt(t)))+self.infiltrations[mask]["C1"]

