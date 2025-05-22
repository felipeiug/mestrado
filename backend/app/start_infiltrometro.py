from app.utils import *
import matplotlib.pyplot as plt

path_infiltracao = "D:/Mestrado/Trabalho Final/SIG/DadosInfiltracao.zip"
path_mdt = "D:/Mestrado/Trabalho Final/SIG\MDT.tif"
path_uso_solo = "D:/Mestrado/Trabalho Final/SIG/USOSOLO.tif"

dados_infiltracao = gpd.read_file(path_infiltracao)

# Inicializando a classe
infiltrometro = Infiltrometro(dados_infiltracao)

Infiltrado = infiltrometro.Infiltrado("10:00")

# mask = gpd.read_file(r"F:\Mestrado\Trabalho Final\Auxilio Petrobrás\mapas_nov_2024\Shp\bacia_regap.shp")
# raster_infiltrado = infiltrometro.raster_infiltrado(t="10:00", mask=mask)
# raster_infiltrado.rio.to_raster("test.tif")

I = infiltrometro.I(10)
K = infiltrometro.K()
S = infiltrometro.S()

fig = plt.figure(figsize=(10, 5))
ax = fig.add_subplot(projection="ternary", ternary_sum=100.0)
infiltrometro.plot_soil_texture(fig, ax)

plt.show()

print(K)