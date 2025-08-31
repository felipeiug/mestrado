import pandas as pd
from utils import Infiltrometro

infil = pd.read_excel(r"D:\Mestrado\Trabalho Final\Dados\Levantamento em Campo\Compiled.xlsx", sheet_name="Infiltracao")
infil = Infiltrometro(infil)

K = infil.K()

print(K)
K.to_excel(r"K.xlsx", sheet_name="K")