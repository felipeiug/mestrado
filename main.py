import pandas as pd
from utils import Infiltrometro, plot_soil_texture_classes
import matplotlib.pyplot as plt

# infil = pd.read_excel(r"D:\Mestrado\Trabalho Final\Dados\Levantamento em Campo\Compiled.xlsx", sheet_name="Infiltracao")
# infil = Infiltrometro(infil)

fig = plt.figure()
ax = fig.add_subplot(projection='ternary')
plot_soil_texture_classes(ax)

# infil.plot_soil_texture(fig, ax)

plt.show()
