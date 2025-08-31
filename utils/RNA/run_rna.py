import geopandas as gpd
import pandas as pd
import rioxarray as rx
from time import sleep
from app.utils.raster.tipo_uso import tipo_uso

class RunRNA:

    a = 1+'' #TODO: Montar a base de dados com todos os dados disponíveis.
    def __init__(self, table_data_path:str, mdt_path:str, soil_cover_path:str):
        print("Iniciando Machine Learning")

        print("Lendo dados tabelados")
        self.dados_tabela = pd.read_excel(table_data_path)
        print("✔ Dados tabelados")
        
        print("Lendo MDT")
        self.mdt = rx.open_rasterio(mdt_path)
        print("✔ MDT")

        print("Lendo uso solo")
        self.tipo_uso_solo = tipo_uso
        self.soil_cover = rx.open_rasterio(soil_cover_path)
        print("✔ Uso do solo")
