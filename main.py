import pandas as pd
from utils import Infiltrometro
import matplotlib.pyplot as plt

infil = pd.read_excel(r"D:\Mestrado\Trabalho Final\Dados\Levantamento em Campo\Compiled.xlsx", sheet_name="Infiltracao")
infil = Infiltrometro(infil)

fig = plt.figure()
ax = fig.add_subplot(projection='ternary')

infil.plot_soil_texture(fig, ax)

plt.show()
