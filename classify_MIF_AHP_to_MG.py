import jenkspy
import numpy as np
import pandas as pd
import xarray as xr
import rioxarray as rxr

from tqdm import tqdm
from utils import USO_SOLO_MAPBIOMAS
from time import sleep

print("Tabela de fatores de influência")
fatores = ["Form. Geo.", "Uso Solo", "Declividade", "Elevação", "Textura"]

tabela_pesos = pd.DataFrame({
    "Fator":fatores,
    "Influência AHP": [0.419, 0.263, 0.160, 0.097, 0.062],
    "Influência MIF": [0.278, 0.222, 0.167, 0.167, 0.167],
})
print("Tabela de pesos:")
print(tabela_pesos)


# ------------------------------------------------------------------
# CONFIGURAÇÕES
# ------------------------------------------------------------------

tipos_unicos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
chunks = {"x": 1024, "y": 1024}

# ------------------------------------------------------------------
# LOOP PRINCIPAL
# ------------------------------------------------------------------


print("Rodando loop")
tipos_unicos = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
chunks = {"x": 1024, "y": 1024}

for forma in []: #["MIF", "AHP"]:
    tipo = f"Influência {forma}"

    print("Obtendo dados do raster original")
    uni_geo = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/UnidadesGeologicas_MG.tif")
    coords={"x": uni_geo.x, "y": uni_geo.y}
    original_crs = uni_geo.rio.crs

    print("Lendo demais rasteres")
    print("Uni. Geológica")
    uni_geo:np.ndarray     = uni_geo.values[0].astype("uint8")
    index:np.ndarray = (uni_geo * tabela_pesos[tipo].values[0]).astype("float32")
    del uni_geo



    print("Cálculos para uso do solo")
    print("Uso do Solo")
    uso_solo:np.ndarray    = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/UsoSoloMG.tif").values[0].astype("float32")
    for key, value in USO_SOLO_MAPBIOMAS.items():
        index[uso_solo==key] += (value['infiltration_index'] * tabela_pesos[tipo].values[1]).astype("float32")
    del uso_solo



    print("Cálculos para declividade")
    declividade:np.ndarray = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Slope_MG.tif").values[0].astype("float32")
    index[(declividade < 6.7)]                        += (4 * tabela_pesos[tipo].values[2]).astype("float32")
    index[(declividade >= 6.7)  & (declividade < 20)] += (3 * tabela_pesos[tipo].values[2]).astype("float32")
    index[(declividade >= 20) & (declividade < 40)]   += (2 * tabela_pesos[tipo].values[2]).astype("float32")
    index[(declividade >= 40)]                        += (1 * tabela_pesos[tipo].values[2]).astype("float32")
    index[(declividade < 0)|(declividade > 360)]      = np.nan
    del declividade



    print("Cálculos para elevação")
    elevacao:np.ndarray    = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/Elevation_MG.tif").values[0].astype("float32")
    index[ elevacao  <  300]                      += (9 * tabela_pesos[tipo].values[3]).astype("float32")
    index[(elevacao >=  300) & (elevacao <  500)] += (8 * tabela_pesos[tipo].values[3]).astype("float32")
    index[(elevacao >=  500) & (elevacao <  600)] += (7 * tabela_pesos[tipo].values[3]).astype("float32")
    index[(elevacao >=  600) & (elevacao <  700)] += (6 * tabela_pesos[tipo].values[3]).astype("float32")
    index[(elevacao >=  700) & (elevacao <  800)] += (5 * tabela_pesos[tipo].values[3]).astype("float32")
    index[(elevacao >=  800) & (elevacao <  900)] += (4 * tabela_pesos[tipo].values[3]).astype("float32")
    index[(elevacao >=  900) & (elevacao < 1100)] += (3 * tabela_pesos[tipo].values[3]).astype("float32")
    index[(elevacao >= 1100) & (elevacao < 1300)] += (2 * tabela_pesos[tipo].values[3]).astype("float32")
    index[(elevacao >= 1300)]                     += (1 * tabela_pesos[tipo].values[3]).astype("float32")
    index[elevacao < 0]                            = np.nan
    del elevacao



    print("Cálculos para a Textura")
    tipo_solo:np.ndarray   = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/TipoSoloIDE_MG.tif").values[0].astype("uint8")
    for tipo_unico in tipos_unicos:
        index[tipo_solo==tipo_unico] += (tipo_unico * tabela_pesos[tipo].values[4]).astype("float32")
    del tipo_solo



    # # Outras informações
    # index.values[np.isnan(index.values)] = -9999

    # # (opcional) definir valor nodata
    # index = index.rio.write_nodata(-9999)

    # Salvar como GeoTIFF
    xr_array = xr.DataArray(
        index.astype("float32"),
        dims=("y", "x"),
        coords=coords,
        name=f"classificacao_potencial_{tipo.lower()}"
    )
    del coords, index

    # Copiar CRS e transformar em um raster compatível
    # xr_array = xr_array.rio.write_crs(original_crs)
    # xr_array = xr_array.rio.reproject_match(potencial_infiltracao)

    # (opcional) definir valor nodata
    # xr_array = xr_array.rio.write_nodata(-9999)

    # Salvar como GeoTIFF
    saida = fr"D:\Mestrado\Trabalho Final\SIG\Potencial_MG_{forma}.tif"
    xr_array.rio.to_raster(saida)
    del xr_array
    print(f"✅ Raster salvo com sucesso em: '{saida}'")


# Fazer esta parte, não colocarei junto.

uni_geo = rxr.open_rasterio(r"D:/Mestrado/Trabalho Final/SIG/UnidadesGeologicas_MG.tif")
coords={"x": uni_geo.x, "y": uni_geo.y}
original_crs = uni_geo.rio.crs
del uni_geo

for forma in ["MIF", "AHP"]:
    # Classificação utilizando Jenks
    k = 5

    print(f"Lendo potencial {forma}")
    potencial_infiltracao = rxr.open_rasterio(rf'D:\Mestrado\Trabalho Final\SIG\Potencial_MG_{forma}.tif')

    flat = potencial_infiltracao.values[0].flatten()
    del potencial_infiltracao
    flat = flat[flat>=0]

    print(f"Calculando Jenks {forma}")
    choices = np.random.choice(flat, size=100_000, replace=False)
    del flat
    breaks = jenkspy.jenks_breaks(choices, n_classes=k)
    breaks[-1] = 100 # Valor alto para ser "Menor" que ele
    # del choices
    print(f"Tipo: {forma}\nClasses Jenks:\n\t{'\n\t'.join([str(i) for i in breaks[1:]])}")

    print("Lendo potencial de infiltração")
    potencial_infiltracao = rxr.open_rasterio(rf'D:\Mestrado\Trabalho Final\SIG\Potencial_MG_{forma}.tif').values[0].astype("float32")
    classificacao_potencial = np.zeros_like(potencial_infiltracao).astype("uint8")


    last_break = None
    now_break = None
    for i, _break in tqdm(enumerate(breaks[1:], 1), desc="Processando", total=len(breaks)):
        now_break = _break

        mask = potencial_infiltracao <= now_break

        if last_break is not None:
            mask = mask & (potencial_infiltracao > last_break)
        last_break = now_break

        classificacao_potencial[mask] = i
        del mask

    # Criar um novo DataArray com as mesmas coordenadas e metadados
    print("Gerando Raster")
    potencial_de = xr.DataArray(
        classificacao_potencial.astype("uint8"),
        dims=("y", "x"),
        coords=coords,
        name=f"classificacao_potencial_{forma}"
    )

    # Copiar CRS e transformar em um raster compatível
    potencial_de = potencial_de.rio.write_crs(original_crs)
    # potencial_de = potencial_de.rio.reproject_match(potencial_infiltracao)

    # (opcional) definir valor nodata
    # potencial_de = potencial_de.rio.write_nodata(-9999)

    # Salvar como GeoTIFF
    print("Salvando Raster")
    saida = fr"D:\Mestrado\Trabalho Final\SIG\Classificacao_Infiltracao_MG_{forma}.tif"
    potencial_de.rio.to_raster(saida)
    print(f"✅ Raster salvo com sucesso em: '{saida}'")