from utils import *
import matplotlib.pyplot as plt

file = f"D:/Mestrado/Trabalho Final/Dados/Levantamento em Campo/DadosInfiltracao.zip"
data = gpd.read_file(file)

# Inicializando a classe
infiltrometro = Infiltrometro(data)

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