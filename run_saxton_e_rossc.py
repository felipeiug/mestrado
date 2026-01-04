import os
import ahpy
import json
import math
import random
import hashlib
import jenkspy
import numpy as np
import pandas as pd
import xarray as xr
import geopandas as gpd
import rioxarray as rxr
import matplotlib.pyplot as plt

from utils import Infiltrometro, ALL_FUNCTIONS, nse, points_distance, USO_SOLO_CLASS, SOIL_TYPES, run_rf_xgb

from tqdm import tqdm
from xgboost import XGBRegressor
from shapely.geometry import Point
from scipy.optimize import curve_fit
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from itertools import combinations, product, islice
from sklearn.metrics import root_mean_squared_error
from sklearn.preprocessing import QuantileTransformer

# Raster com os valores
print("Lendo Rasteres")
textura = rxr.open_rasterio(r"D:\Mestrado\Trabalho Final\SIG\20_SOILTYPE.tif") # Textura a 20 cm

keys = [i for i in ALL_FUNCTIONS.keys()]
keys.extend(['XGB', 'RF'])

for key in keys:
    path = f"D:\Mestrado\Trabalho Final\SIG\Ks_{key}.tif"
    raster = rxr.open_rasterio(path, masked=True)

    if key == "RF" or key == "XGB":
        values = np.pow(10, raster.values)
        values[raster.values == 0] = 0
    else:
        values = raster.values

    values[values < 0] = -9999
    values[np.isnan(values)] = -9999
    values = values.reshape(textura.shape[1:])

    # Criar um novo DataArray com as mesmas coordenadas e metadados
    potencial_da = xr.DataArray(
        values.astype("float32"),
        dims=("y", "x"),
        coords={"x": textura.x, "y": textura.y},
        name=f"potencial_infiltracao_{key.lower()}"
    )

    # Copiar CRS e transformar em um raster compatível
    potencial_da = potencial_da.rio.write_crs(textura.rio.crs)
    potencial_da = potencial_da.rio.reproject_match(textura)

    # (opcional) definir valor nodata
    potencial_da = potencial_da.rio.write_nodata(-9999)

    # Salvar como GeoTIFF
    saida = fr"D:\Mestrado\Trabalho Final\SIG\Potencial_Infiltracao_{key}.tif"
    # potencial_da.rio.to_raster(saida)
    print(f"✅ Raster salvo com sucesso em: '{saida}'")

    # Classificação em 5 classes usando Jenks
    
    print(f"Gerando Jenks para {key}")
    breaks = jenkspy.jenks_breaks(np.random.choice(values[values >= 0].flatten(), size=100_000, replace=False), n_classes=5)
    print(f"Tipo: {key}\nClasses Jenks:\n\t{'\n\t'.join([str(i) for i in breaks])}")

    classificacao_potencial = np.full_like(values, fill_value=-9999)

    last_break = None
    now_break = None
    for i, _break in enumerate(breaks, 1):
        now_break = _break

        mask = values <= now_break

        if last_break is not None:
            mask = mask & (values > last_break)
        last_break = now_break

        classificacao_potencial[mask] = i

    maskNone = values < 0
    classificacao_potencial[maskNone] = -9999

    # Criar um novo DataArray com as mesmas coordenadas e metadados
    potencial_da = xr.DataArray(
        classificacao_potencial.astype("float32"),
        dims=("y", "x"),
        coords={"x": textura.x, "y": textura.y},
        name=f"potencial_infiltracao_{key.lower()}"
    )

    # Copiar CRS e transformar em um raster compatível
    potencial_da = potencial_da.rio.write_crs(textura.rio.crs)
    potencial_da = potencial_da.rio.reproject_match(textura)

    # (opcional) definir valor nodata
    potencial_da = potencial_da.rio.write_nodata(-9999)

    # Salvar como GeoTIFF
    saida = fr"D:\Mestrado\Trabalho Final\SIG\Classificacao_Infiltracao_{key}.tif"
    # potencial_da.rio.to_raster(saida)
    print(f"✅ Raster salvo com sucesso em: '{saida}'")

    print(f"Gerando Jenks Classificação {key}")
    breaks = jenkspy.jenks_breaks(np.random.choice(classificacao_potencial[classificacao_potencial>=0].flatten(), size=100_000, replace=False), n_classes=5)
    print(f"Tipo: {key}\nClasses Jenks:\n\t{'\n\t'.join([str(i) for i in breaks])}")