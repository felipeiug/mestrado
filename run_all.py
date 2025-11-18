# %%
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

from utils import Infiltrometro, ALL_FUNCTIONS, nse, points_distance, USO_SOLO_CLASS, SOIL_TYPES

from tqdm import tqdm
from xgboost import XGBRegressor
from shapely.geometry import Point
from scipy.optimize import curve_fit
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from itertools import combinations, product, islice
from sklearn.metrics import root_mean_squared_error
from sklearn.preprocessing import QuantileTransformer

# %%
metodo = 2

# %%
# Método 1
if metodo == 1:
    fatores = ["Textura", "Uso Solo", "Form. Geo.", "Elevação", "Declividade", "Rugosidade", "Aspecto"]

# Método 2
elif metodo == 2:
    fatores = ["Form. Geo.", "Uso Solo", "Declividade", "Elevação", "Textura"]

tabela_pesos = pd.DataFrame({
    "Fator":fatores,
    "Influência AHP": [None] * len(fatores),
    "Influência MIF": [None] * len(fatores),
})

tabela_pesos

# %% [markdown]
# # 🧭 Método AHP — Analytical Hierarchy Process
# ### Suprapti et al. (2024)
# 
# Aplicação do método **AHP (Analytical Hierarchy Process)** para determinar o peso relativo dos fatores que influenciam o potencial de infiltração de água no solo, conforme descrito por **Suprapti et al. (2024)**.  
# Etapas principais:
# 1. Definir os fatores de influência  
# 2. Construir a matriz de comparação par-a-par (escala de Saaty 1–9)  
# 3. Calcular os pesos (autovetor normalizado)  
# 4. Verificar a consistência (CR ≤ 0.1)

# %%
# ------------------------------
# Matriz de comparação par a par (exemplo de Suprapti et al. 2024)
# Fatores (Ordenados do mais importante ao menos importante):
#
# 1° Teste:
# - Textura
# - Tipo de Solo (IDE ou a Partir da Textura)
# - Uso do Solo
# - Formação Geológica
# - Elevação
# - Declividade (Slope)
# - Rugosidade
# - Aspecto
#
# 2° Teste:
# Substitui a precipitação pela elevação, visto que a elevação na bacia influencia muito na precipitação.
# - Formação Geológica
# - Uso do Solo
# - Declividade (Slope)
# - Altitude
# - Textura ou Tipo de Solo (IDE ou a Partir da Textura)

# As relações tem peso de 1 a 7, com 1 sendo relação fraca e 7 relação forte.
# ------------------------------

# Definir os julgamentos par-a-par
if metodo == 1:
    comparisons = {
        # Textura
        ('Textura', 'Uso Solo'):     2,
        ('Textura', 'Form. Geo.'):   3,
        ('Textura', 'Elevação'):     4,
        ('Textura', 'Declividade'):  5,
        ('Textura', 'Rugosidade'):   6,
        ('Textura', 'Aspecto'):      7,

        # Tipo de Solo
        # ('Tipo de Solo', 'Uso Solo'):    2,
        # ('Tipo de Solo', 'Form. Geo.'):  3,
        # ('Tipo de Solo', 'Elevação'):    4,
        # ('Tipo de Solo', 'Declividade'): 5,
        # ('Tipo de Solo', 'Rugosidade'):  6,
        # ('Tipo de Solo', 'Aspecto'):     7,

        # Uso Solo
        ('Uso Solo', 'Form. Geo.'):   2,
        ('Uso Solo', 'Elevação'):     3,
        ('Uso Solo', 'Declividade'):  4,
        ('Uso Solo', 'Rugosidade'):   5,
        ('Uso Solo', 'Aspecto'):      6,

        # Form. Geo.
        ('Form. Geo.', 'Elevação'):    2,
        ('Form. Geo.', 'Declividade'): 3,
        ('Form. Geo.', 'Rugosidade'):  4,
        ('Form. Geo.', 'Aspecto'):     5,

        # Elevação
        ('Elevação', 'Declividade'): 2,
        ('Elevação', 'Rugosidade'):  3,
        ('Elevação', 'Aspecto'):     4,

        # Declividade
        ('Declividade', 'Rugosidade'): 2,
        ('Declividade', 'Aspecto'):    3,

        # Rugosidade
        ('Rugosidade', 'Aspecto'): 2,
    }

elif metodo == 2:
    comparisons = {
        # Form. Geo.
        ('Form. Geo.', 'Uso Solo')   : 2,
        ('Form. Geo.', 'Declividade'): 3,
        ('Form. Geo.', 'Elevação'):    4,
        ('Form. Geo.', 'Textura'):     5,

        # Uso Solo
        ('Uso Solo', 'Declividade'): 2,
        ('Uso Solo', 'Elevação'):    3,
        ('Uso Solo', 'Textura'):     4,

        # Declividade
        ('Declividade', 'Elevação'):    2,
        ('Declividade', 'Textura'):     3,

        # Elevação
        ('Elevação', 'Textura'):     2,
    }

# Criar o objeto AHP
AHP_criteria = ahpy.Compare('Infiltração', comparisons, precision=3, random_index='saaty')

# Resultados
print(f"Critério: {AHP_criteria.report()["elements"]["consistency_ratio"]}", end=" ")
if AHP_criteria.report()["elements"]["consistency_ratio"] < 0.1:
    print("✅ Consistente")
else:
    print("⚠️ O critério deve ser ≤ 0.1")

print()
for key, val in AHP_criteria.report()["elements"]["global_weights"].items():
    tabela_pesos.loc[tabela_pesos["Fator"] == key, "Influência AHP"]=val

tabela_pesos

# %% [markdown]
# # 🌧️ Método MIF — Multi Influencing Factors
# ### Suprapti et al. (2024)
# 
# Avaliação do peso relativo dos fatores de influência na infiltração de água no solo, conforme o método **MIF (Multi Influencing Factors)** descrito por **Suprapti et al. (2024)**.  
# Etapas básicas:
# 1. Definir fatores de influência  
# 2. Atribuir pesos (1 = forte, 0.5 = indireta, 0 = sem influência)  
# 3. Somar e normalizar os valores para obter os pesos finais (Wᵢ)
# 

# %%
# -----------------------------
# 1) Matriz de influência (baseada em Suprapti et al., 2024)
# 1 = influência direta forte
# 0.5 = influência indireta
# 0 = sem influência
# -----------------------------

if metodo == 1:
    comparisons = {
        # Textura
        ('Textura', 'Textura'):      0,
        ('Textura', 'Tipo de Solo'): 1,
        ('Textura', 'Uso Solo'):     0,
        ('Textura', 'Form. Geo.'):   0.5,
        ('Textura', 'Elevação'):     0,
        ('Textura', 'Declividade'):  0,
        ('Textura', 'Rugosidade'):   0,
        ('Textura', 'Aspecto'):      0,

        # Tipo de Solo
        # ('Tipo de Solo', 'Textura'):      1,
        # ('Tipo de Solo', 'Tipo de Solo'): 0,
        # ('Tipo de Solo', 'Uso Solo'):     0,
        # ('Tipo de Solo', 'Form. Geo.'):   0.5,
        # ('Tipo de Solo', 'Elevação'):     0,
        # ('Tipo de Solo', 'Declividade'):  0,
        # ('Tipo de Solo', 'Rugosidade'):   0,
        # ('Tipo de Solo', 'Aspecto'):      0,

        # Uso Solo
        ('Uso Solo', 'Textura'):      1,
        ('Uso Solo', 'Tipo de Solo'): 0,
        ('Uso Solo', 'Uso Solo'):     0,
        ('Uso Solo', 'Form. Geo.'):   0.5,
        ('Uso Solo', 'Elevação'):     0.5,
        ('Uso Solo', 'Declividade'):  0.5,
        ('Uso Solo', 'Rugosidade'):   0.5,
        ('Uso Solo', 'Aspecto'):      0.5,

        # Form. Geo.
        ('Form. Geo.', 'Textura'):      0.5,
        ('Form. Geo.', 'Tipo de Solo'): 0,
        ('Form. Geo.', 'Uso Solo'):     0,
        ('Form. Geo.', 'Form. Geo.'):   0,
        ('Form. Geo.', 'Elevação'):     0.5,
        ('Form. Geo.', 'Declividade'):  0.5,
        ('Form. Geo.', 'Rugosidade'):   0.5,
        ('Form. Geo.', 'Aspecto'):      0.5,

        # Elevação
        ('Elevação', 'Textura'):      0,
        ('Elevação', 'Tipo de Solo'): 0,
        ('Elevação', 'Uso Solo'):     0.5,
        ('Elevação', 'Form. Geo.'):   0,
        ('Elevação', 'Elevação'):     0,
        ('Elevação', 'Declividade'):  0,
        ('Elevação', 'Rugosidade'):   1,
        ('Elevação', 'Aspecto'):      1,

        # Declividade
        ('Declividade', 'Textura'):      0,
        ('Declividade', 'Tipo de Solo'): 0,
        ('Declividade', 'Uso Solo'):     0.5,
        ('Declividade', 'Form. Geo.'):   0,
        ('Declividade', 'Elevação'):     0.5,
        ('Declividade', 'Declividade'):  0,
        ('Declividade', 'Rugosidade'):   1,
        ('Declividade', 'Aspecto'):      1,

        # Rugosidade
        ('Rugosidade', 'Textura'):      0,
        ('Rugosidade', 'Tipo de Solo'): 0,
        ('Rugosidade', 'Uso Solo'):     0,
        ('Rugosidade', 'Form. Geo.'):   0,
        ('Rugosidade', 'Elevação'):     0.5,
        ('Rugosidade', 'Declividade'):  0.5,
        ('Rugosidade', 'Rugosidade'):   0,
        ('Rugosidade', 'Aspecto'):      1,

        # Aspecto
        ('Aspecto', 'Textura'):      0,
        ('Aspecto', 'Tipo de Solo'): 0,
        ('Aspecto', 'Uso Solo'):     0,
        ('Aspecto', 'Form. Geo.'):   0,
        ('Aspecto', 'Elevação'):     0,
        ('Aspecto', 'Declividade'):  0,
        ('Aspecto', 'Rugosidade'):   0,
        ('Aspecto', 'Aspecto'):      0,
    }

elif metodo == 2:
    comparisons = {
        # Form. Geo.
        ('Form. Geo.', 'Form. Geo.') : 0,
        ('Form. Geo.', 'Uso Solo')   : 1,
        ('Form. Geo.', 'Declividade'): 0.5,
        ('Form. Geo.', 'Elevação'):    0,
        ('Form. Geo.', 'Textura'):     1,
        
        # Uso Solo
        ('Uso Solo', 'Form. Geo.') : 0.5,
        ('Uso Solo', 'Uso Solo')   : 0,
        ('Uso Solo', 'Declividade'): 0.5,
        ('Uso Solo', 'Elevação'):    1,
        ('Uso Solo', 'Textura'):     0,
        
        # Declividade
        ('Declividade', 'Form. Geo.') : 0,
        ('Declividade', 'Uso Solo')   : 0.5,
        ('Declividade', 'Declividade'): 0,
        ('Declividade', 'Elevação'):    1,
        ('Declividade', 'Textura'):     0,
        
        # Elevação
        ('Elevação', 'Form. Geo.') : 0,
        ('Elevação', 'Uso Solo')   : 0.5,
        ('Elevação', 'Declividade'): 0.5,
        ('Elevação', 'Elevação'):    0,
        ('Elevação', 'Textura'):     0.5,
        
        # Elevação
        ('Textura', 'Form. Geo.') : 0.5,
        ('Textura', 'Uso Solo')   : 1,
        ('Textura', 'Declividade'): 0,
        ('Textura', 'Elevação'):    0,
        ('Textura', 'Textura'):     0,
    }

mtx = []
for i, fator1 in enumerate(fatores):
    mtx.append([])

    for j, fator2 in enumerate(fatores):
        mtx[i].append(comparisons[(fator1, fator2)])


MIF = pd.DataFrame(mtx, columns=fatores, index=fatores)

print("📊 Matriz de Influência (MIF):")
print(MIF)

# -----------------------------
# 2) Somar as influências de cada fator
# -----------------------------
soma = MIF.sum(axis=1)
total = soma.sum()

# -----------------------------
# 3) Calcular pesos normalizados (Wi)
# -----------------------------
pesos = soma / total
tabela_pesos["Influência MIF"] = pesos.values.round(3)

tabela_pesos

# %% [markdown]
# ### Lendo os rasteres para utilizar nos métodos

# %%
fatores

# %%
print("Lendo Rasteres")
textura         = rxr.open_rasterio(r"D:\Mestrado\Trabalho Final\SIG\20_SOILTYPE.tif")             # Textura a 20 cm
tipo_solo       = rxr.open_rasterio(r"D:\Mestrado\Trabalho Final\SIG\TipoSoloIDE.tif")             # Tipo de Solo IDE Sisema
uso_solo        = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/USOSOLO.tif")                 # Tipos de uso do solo
form_geo        = rxr.open_rasterio(r"D:\Mestrado\Trabalho Final\SIG\FormacaoGeologica.tif")       # Formação Geológica
elevation       = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Elevation.tif")               # Elevação
slope           = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Slope.tif")                   # Declividade
roughness       = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Roughness.tif")               # A diferença entre a elevação máxima e mínima dentro de uma vizinhança
aspect          = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Aspect.tif")                  # Para onde "aponta" a face do terreno

# %% [markdown]
# # Variáveis de Apoio

# %%
# Textura

texture_index = np.zeros_like(textura, dtype=float)

for tipo, values in SOIL_TYPES.items():
    texture_index[textura.values == tipo] = values['infiltration_index']
texture_index[textura<0] = np.nan

texture_index


# %%
# Uso do solo para influência na infiltração

uso_solo_index = np.zeros_like(uso_solo, dtype=float)

for tipo, values in USO_SOLO_CLASS.items():
    uso_solo_index[uso_solo.values == tipo] = values['infiltration_index']

uso_solo_index[uso_solo.values < 0] = np.nan
uso_solo_index

# %%
# Influência da formação geológica na infiltração

index = {
    467:  1, # Complexo Belo Horizonte - Rochas cristalinas e pouco fraturadas → baixa permeabilidade primária; infiltração depende quase totalmente de fraturas ou zonas de alteração.
    1234: 2, # Grupo Sabará - Argilas e foliações dificultam o fluxo vertical; infiltração ocorre preferencialmente em fraturas e zonas de cisalhamento.
    3007: 3, # Formação Cauê - Apesar da baixa porosidade intrínseca, as zonas de fratura e dissolução local aumentam a infiltração; condutividade moderada.
    1111: 4, # Grupo Piracicaba - A presença dominante de quartzitos (permeáveis) aumenta o potencial de infiltração, apesar da intercalação de filitos reduzir localmente.
}

form_geo_index = np.zeros_like(form_geo, dtype=float)

for tipo, value in index.items():
    form_geo_index[form_geo.values == tipo] = value
form_geo_index[form_geo.values < 0] = np.nan

form_geo_index


# %%
elevation_index = np.zeros_like(elevation.values, dtype=float)


elevation_index[(elevation_index < 800)] = 9
elevation_index[(elevation_index >= 800) & (elevation_index < 900)] = 8
elevation_index[(elevation_index >= 900) & (elevation_index < 1000)] = 7
elevation_index[(elevation_index >= 1000) & (elevation_index < 1100)] = 6
elevation_index[(elevation_index >= 1100) & (elevation_index < 1200)] = 5
elevation_index[(elevation_index >= 1200) & (elevation_index < 1300)] = 4
elevation_index[(elevation_index >= 1300) & (elevation_index < 1400)] = 3
elevation_index[(elevation_index >= 1400) & (elevation_index < 1500)] = 2
elevation_index[(elevation_index >= 1500)] = 1
elevation_index[elevation.values < 0] = np.nan

elevation_index

# %%
# Declividade é similar a rugosidade, pois quanto maior for a declividade menor é a infiltração
slope_index = np.zeros_like(slope.values, dtype=float)

slope_index[(slope_index < 8)]                        = 4
slope_index[(slope_index >= 8)  & (slope_index < 15)] = 3
slope_index[(slope_index >= 15) & (slope_index < 25)] = 2
slope_index[(slope_index >= 25)]                      = 1
slope_index[slope.values < 0] = np.nan

slope_index

# %%
# Rugosidade para influência na infiltração
# Relação com o inverso da rugosidade
# Rugosidade alta  → terreno irregular → maior escoamento superficial e menor infiltração.
# Rugosidade baixa → relevo suave      → favorece infiltração.

Rmin, Rmax = roughness.values[roughness.values>=0].min(), roughness.values[roughness.values>=0].max()

roughness_index = 1 - ((roughness.values - Rmin) / (Rmax - Rmin))
roughness_index[roughness_index < 0] = 0
roughness_index[roughness_index > 1] = 1

roughness_index

# %%
# Aspecto para % de insolação

aspect_per_sun_index = np.zeros_like(aspect, dtype=float)

# Norte (315–360 e 0–45) - Maior insolação, menor infiltração
aspect_per_sun_index[(aspect >= 315) | (aspect <= 45)] = 0.25

# Leste (45–135) - Insolação média, porém por mais tempo
aspect_per_sun_index[(aspect > 45) & (aspect <= 135)] = 0.75

# Sul (135–225) - Insolação baixa
aspect_per_sun_index[(aspect > 135) & (aspect <= 225)] = 1.00

# Oeste (225–315) - Insolação maior, porém por menos tempo
aspect_per_sun_index[(aspect > 225) & (aspect < 315)] = 0.50

# Valores nulos ou sem dados (ex.: -1)
aspect_per_sun_index[aspect < 0] = np.nan

aspect_per_sun_index

# %% [markdown]
# # Cálculos dos valores de Potencial de infiltração para cada um dos métodos
# 
# ## Método de Jenks

# %%
tabela_pesos

# %%
for tipo in ["MIF", "AHP"]:
    if metodo == 1:
        potencial_infiltracao = (
            tabela_pesos.loc[0][f"Influência {tipo}"] * texture_index + \
            tabela_pesos.loc[1][f"Influência {tipo}"] * uso_solo_index + \
            tabela_pesos.loc[2][f"Influência {tipo}"] * form_geo_index + \
            tabela_pesos.loc[3][f"Influência {tipo}"] * elevation_index + \
            tabela_pesos.loc[4][f"Influência {tipo}"] * slope_index + \
            tabela_pesos.loc[5][f"Influência {tipo}"] * roughness_index + \
            tabela_pesos.loc[6][f"Influência {tipo}"] * aspect_per_sun_index
        )
    elif metodo == 2:
        potencial_infiltracao = (
            tabela_pesos.loc[0][f"Influência {tipo}"] * form_geo_index + \
            tabela_pesos.loc[1][f"Influência {tipo}"] * uso_solo_index + \
            tabela_pesos.loc[2][f"Influência {tipo}"] * slope_index + \
            tabela_pesos.loc[3][f"Influência {tipo}"] * elevation_index + \
            tabela_pesos.loc[4][f"Influência {tipo}"] * texture_index
        )

    potencial_infiltracao[np.isnan(potencial_infiltracao)] = -9999

    # Garantir que o resultado tem o mesmo shape que o raster base
    potencial_infiltracao = potencial_infiltracao.reshape(textura.shape[1:])

    # Criar um novo DataArray com as mesmas coordenadas e metadados
    potencial_da = xr.DataArray(
        potencial_infiltracao.astype("float32"),
        dims=("y", "x"),
        coords={"x": textura.x, "y": textura.y},
        name=f"potencial_infiltracao_{tipo.lower()}"
    )

    # Copiar CRS e transformar em um raster compatível
    potencial_da = potencial_da.rio.write_crs(textura.rio.crs)
    potencial_da = potencial_da.rio.reproject_match(textura)

    # (opcional) definir valor nodata
    potencial_da = potencial_da.rio.write_nodata(-9999)

    # Salvar como GeoTIFF
    saida = fr"D:\Mestrado\Trabalho Final\SIG\Potencial_Infiltracao_{tipo}_{metodo}.tif"
    potencial_da.rio.to_raster(saida)
    print(f"✅ Raster salvo com sucesso em: '{saida}'")

    
    # Classificação utilizando Jenks
    k = 5

    flat = potencial_infiltracao.flatten()
    flat = flat[flat>=0]
    breaks = jenkspy.jenks_breaks(flat, n_classes=k)

    print(f"Tipo: {tipo}\nMétodo: {metodo}\nClasses Jenks:\n\t{'\n\t'.join([str(i) for i in breaks])}")

    classificacao_potencial = np.full_like(potencial_infiltracao, fill_value=-9999)

    last_break = None
    now_break = None
    for i, _break in enumerate(breaks[1:], 1):
        now_break = _break

        mask = potencial_infiltracao <= now_break

        if last_break is not None:
            mask = mask & (potencial_infiltracao > last_break)
        last_break = now_break

        classificacao_potencial[mask] = i
    
    maskNone = potencial_infiltracao < 0
    classificacao_potencial[maskNone] = -9999

    # Criar um novo DataArray com as mesmas coordenadas e metadados
    potencial_de = xr.DataArray(
        classificacao_potencial.astype("float32"),
        dims=("y", "x"),
        coords={"x": textura.x, "y": textura.y},
        name=f"classificacao_potencial_{tipo.lower()}"
    )

    # Copiar CRS e transformar em um raster compatível
    potencial_de = potencial_de.rio.write_crs(textura.rio.crs)
    potencial_de = potencial_de.rio.reproject_match(textura)

    # (opcional) definir valor nodata
    potencial_de = potencial_de.rio.write_nodata(-9999)

    # Salvar como GeoTIFF
    saida = fr"D:\Mestrado\Trabalho Final\SIG\Classificacao_Infiltracao_{tipo}_{metodo}.tif"
    potencial_de.rio.to_raster(saida)
    print(f"✅ Raster salvo com sucesso em: '{saida}'")

# %%
# K = rxr.open_rasterio(r"D:\Mestrado\Trabalho Final\SIG\CondutividadeHidraulica.tif").values[0]

# Kmin = K.min()
# Kmax = K.max()

# (Kmin, Kmax)

# plt.hist(K.flatten(), bins=50)

# # Adiciona rótulos e título
# plt.title("Histograma dos dados")
# plt.xlabel("Valor")
# plt.ylabel("Frequência")

# # Mostra o gráfico
# plt.show()

# %%
# K_index = ((K - Kmin) / (Kmax - Kmin))


# # Classificação
# # 0 - 0.005 Baixo
# # 0.005 - 0.01 Baixo a Médio
# # 0.01 - 0.02 Médio
# # 0.02 - 0.03 Médio a Alto
# # 0.03 > Alto
# mask1 = K <= 0.005
# mask2 = (K > 0.005) & (K <= 0.010)
# mask3 = (K > 0.010) & (K <= 0.015)
# mask4 = (K > 0.015) & (K <= 0.020)
# mask5 = (K > 0.020)
# maskNone = (K == -9999) | (K < 0)

# K_index = K.copy()
# K_index[mask1] = 1
# K_index[mask2] = 2
# K_index[mask3] = 3
# K_index[mask4] = 4
# K_index[mask5] = 5
# K_index[maskNone] = -9999


# potencial_de = xr.DataArray(
#     K_index.astype("float32"),
#     dims=("y", "x"),
#     coords={"x": textura.x, "y": textura.y},
#     name=f"class_condutividade_hidro"
# )

# # Copiar CRS e transformar em um raster compatível
# potencial_de = potencial_de.rio.write_crs(textura.rio.crs)
# potencial_de = potencial_de.rio.reproject_match(textura)

# # (opcional) definir valor nodata
# potencial_de = potencial_de.rio.write_nodata(-9999)

# # Salvar como GeoTIFF
# saida = fr"D:\Mestrado\Trabalho Final\SIG\ClassificacaoCondutividadeHidraulica.tif"
# potencial_de.rio.to_raster(saida)


