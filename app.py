from utils import *

# Abrir arquivo
data:pd.DataFrame = pd.read_excel(r"F:\Mestrado\Trabalho Final\Dados\Levantamento em Campo\Levantamento em Campo_05_09.xlsx", sheet_name="Dados")
dados_infiltracao = {i:None for i in COLUMNS_INFILTRATION}
dados_infiltracao["Ponto"] = []
dados_infiltracao["Soil Type"] = "Sandy Loam"
dados_infiltracao["Suction"] = -2
for tempo in COLUMNS_INFILTRATION[1:22]:
    dados_infiltracao[tempo] = []

for point in data.columns:
    if point == "Tempos":
        continue

    volumes = data[point]

    dados_infiltracao["Ponto"].append(point)
    for n,tempo in enumerate(COLUMNS_INFILTRATION[1:22]):
        dados_infiltracao[tempo].append(volumes[n])

data = pd.DataFrame(dados_infiltracao)

# Inicializando a classe
infiltrometro = Infiltrometro(data)

I = infiltrometro.I(10)
K = infiltrometro.K()
S = infiltrometro.S()

print(K)