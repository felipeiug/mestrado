import numpy as np
import pandas as pd
import geopandas as gpd
import rioxarray as rxr

from shapely import Point, distance
from pyproj import Transformer
from rasterio.transform import rowcol

import torch
from torch.utils.data import Dataset

# Dataset
class MeuDataset(Dataset):
    nix_bands = [
        "R400 nm", "R410 nm", "R420 nm", "R430 nm",
        "R440 nm", "R450 nm", "R460 nm", "R470 nm",
        "R480 nm", "R490 nm", "R500 nm", "R510 nm",
        "R520 nm", "R530 nm", "R540 nm", "R550 nm",
        "R560 nm", "R570 nm", "R580 nm", "R590 nm",
        "R600 nm", "R610 nm", "R620 nm", "R630 nm",
        "R640 nm", "R650 nm", "R660 nm", "R670 nm",
        "R680 nm", "R690 nm", "R700 nm",
    ]

    columns_dados = ["Ponto", "Lat", "Lon", "soils_type", "Clay", "Silt", "Sand", "K (C1)"]

    def __init__(self, device:torch.device|None=None, eval=False):
        """
        O dataset tem o formato de uma tupla com os valores em X e em Y:
        - (X, Y)
        - Onde:
        - X: (rasters_vals, [Dist. Talvegue, Tipo do Solo, na ordem de soil_types])
        - Y: K (cm/s)
        """
        self.eval = eval
        self.device = device
        self.janela = 25 # Janela deve ser ímpar

        if self.janela%2 == 0:
            raise ValueError("A janela deve ser ímpar")

        # Lendo Tabelas
        print("Lendo Tabelas")
        self.dados = pd.read_excel(r"D:\Mestrado\Trabalho Final\Dados\Levantamento em Campo\Compiled.xlsx", sheet_name="Infiltracao")
        self.dados = self.dados[self.columns_dados].dropna().reset_index(drop=True)
        gdf = gpd.GeoDataFrame(self.dados, geometry=gpd.points_from_xy(self.dados["Lat"], self.dados["Lon"]), crs="EPSG:4326")
        gdf.to_crs("EPSG:31983", inplace=True)
        self.dados['Lat'] = gdf.geometry.y
        self.dados['Lon'] = gdf.geometry.x

        self.nix = pd.read_excel(r"D:\Mestrado\Trabalho Final\Dados\Levantamento em Campo\Compiled.xlsx", sheet_name="Nix")
        self.pXRF = pd.read_excel(r"D:\Mestrado\Trabalho Final\Dados\Levantamento em Campo\Compiled.xlsx", sheet_name="pXRF")

        # Lendo Rasteres importantes
        self.talvegues = gpd.read_file(r"D:/Mestrado/Trabalho Final/SIG/HidrografiaArea.zip")

        # Lendo Rasteres
        print("Lendo Rasteres")
        self.uso_solo        = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/USOSOLO.tif")                 # Tipos de uso do solo
        self.elevation       = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Elevation.tif")               # Elevação
        self.terrain_rug_idx = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/TerrainRuggednessIndex.tif")  # Variação de elevação entre um pixel e seus vizinhos imediatos
        self.topo_pos_idx    = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/TopograficPositionIndex.tif") # Elevação de um ponto com a média da elevação ao redor, topo, vale ou plano
        self.roughness       = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Roughness.tif")               # A diferença entre a elevação máxima e mínima dentro de uma vizinhança
        self.slope           = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Slope.tif")                   # Declividade
        self.aspect          = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Aspect.tif")                  # Para onde "aponta" a face do terreno
        self.texture_02      = rxr.open_rasterio(r"D:\Mestrado\Trabalho Final\SIG\textura_2.tif")               # Textura a 2 cm
        self.texture_20      = rxr.open_rasterio(r"D:\Mestrado\Trabalho Final\SIG\textura_20.tif")              # Textura a 20 cm
        
        # X e Y dos valores
        if self.eval:
            xx, yy = np.meshgrid(self.uso_solo.x.values, self.uso_solo.y.values) # type: ignore
            self.x_y = np.column_stack([xx.ravel(), yy.ravel()])                 # type: ignore

        # Dados dos rasteres concatenados
        self.raster_data = np.array([
            self.uso_solo.values[0], # type: ignore
            self.elevation.values[0], # type: ignore
            self.terrain_rug_idx.values[0], # type: ignore
            self.topo_pos_idx.values[0], # type: ignore
            self.roughness.values[0], # type: ignore
            self.slope.values[0], # type: ignore
            self.aspect.values[0], # type: ignore
            self.texture_02.values[0], # type: ignore
            self.texture_20.values[0], # type: ignore
        ])

        self.transformer = Transformer.from_crs("EPSG:31983", self.uso_solo.rio.crs, always_xy=True) # type: ignore
        self.transform = self.uso_solo.rio.transform() # type: ignore

        print("Processando dados")
        self._process_dados()

    def _process_dados(self):
        # Dados para convolução
        x, y = self.transformer.transform(self.dados["Lon"], self.dados["Lat"])
        row, col = rowcol(self.transform, x, y)

        jan = int((self.janela-1)/2)

        start_row = row-jan
        end_row   = row+jan

        start_col = col-jan
        end_col   = col+jan

        self.dados['s_row']=start_row
        self.dados['e_row']=end_row
        self.dados['s_col']=start_col
        self.dados['e_col']=end_col

        # Distância até o talvegue principal
        self.linhas_unidas = self.talvegues.union_all()
        pontos = gpd.GeoSeries(gpd.points_from_xy(self.dados["Lon"], self.dados["Lat"]), crs="EPSG:31983")
        dists = pontos.apply(lambda p: p.distance(self.linhas_unidas))
        self.dados["dist_talvegue"] = dists


    def __len__(self):
        return self.uso_solo.size if len(self.x_y) else len(self.dados) # type: ignore

    def __getitem__(self, i):
        idx = i
        if isinstance(i, (int, float)):
            idx = [i]
        elif self.eval and (isinstance(i, slice) or isinstance(i, (list, np.ndarray))):
            if isinstance(i, slice):
                indices = list(range(*i.indices(len(self))))
            else:
                indices = i
            
            rasters = []
            values = []
            for idx in indices:
                raster, value = self.__getitem__(idx)
                rasters.append(raster[0])
                values.append(value[0])

            rasters = torch.stack(rasters)
            values = torch.stack(values)
            return rasters, values

        # Modo de gerar os dados finais
        if self.eval:
            x_y = self.x_y[i] # type: ignore
            x, y = self.transformer.transform(x_y[0], x_y[1])
            row, col = rowcol(self.transform, x, y)

            bands, height, width = self.raster_data.shape

            jan = int((self.janela-1)/2)
            window_shape = (bands, 2*jan + 1, 2*jan + 1)

            # Criar janela preenchida com NaN
            janela_data = np.full(window_shape, np.nan, dtype=self.raster_data.dtype)

            # Calcular limites válidos dentro do raster
            row_min = max(0, row - jan) # type: ignore
            row_max = min(height, row + jan + 1) # type: ignore

            col_min = max(0, col - jan) # type: ignore
            col_max = min(width, col + jan + 1) # type: ignore
            
            # Limites relativos à janela
            win_row_start = row_min - (row - jan)
            win_row_end   = win_row_start + (row_max - row_min)

            win_col_start = col_min - (col - jan)
            win_col_end   = win_col_start + (col_max - col_min)
            
            # Copiar a parte válida do raster para a janela
            janela_data[:, win_row_start:win_row_end, win_col_start:win_col_end] = self.raster_data[:, row_min:row_max, col_min:col_max]

            # Distância do talvegue
            p = Point(x, y)
            dist = torch.tensor(np.array([[distance(p, self.linhas_unidas)]]), device=self.device)

            rasters_vals = torch.tensor(np.array([janela_data]), device=self.device, dtype=torch.float64)

            return (rasters_vals, dist)

        # Pontos
        pontos = self.dados.loc[idx]

        # Valores nos rasteres
        rasters_vals = []
        for s_row, e_row, s_col, e_col in zip(pontos['s_row'], pontos['e_row'], pontos['s_col'], pontos['e_col']):
            rasters_vals.append(self.raster_data[:, s_row:e_row+1, s_col:e_col+1])
        
        rasters_vals = torch.tensor(np.array(rasters_vals), device=self.device, dtype=torch.float64)

        # Demais dados
        K = torch.tensor(pontos["K (C1)"].values, device=self.device) * 1000 # K*1000 pois os valores estão baixos de mais
        dist_talvegue = torch.tensor(pontos[["dist_talvegue"]].values, device=self.device)

        if isinstance(i, (int, float)):
            dist_talvegue = dist_talvegue[0]
            rasters_vals = rasters_vals[0]
            K = K[0]


        return (rasters_vals, dist_talvegue), K
    
if __name__ == "__main__":
    dataset = MeuDataset(eval=True)
    dataset[1]
    dataset[1:10]