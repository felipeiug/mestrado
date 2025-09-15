import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from utils import Infiltrometro, ALL_FUNCTIONS

infil = pd.read_excel(r"D:\Mestrado\Trabalho Final\Dados\Levantamento em Campo\Compiled.xlsx", sheet_name="Infiltracao")
infil = Infiltrometro(infil)

# K  = infil.K()  # Este valor de K é o K para -2cm de poropressão.
Ks = infil.Ks() # Ks é a condutividade Hidráulica Saturada.

alfa = Ks["alfa"].values
n = Ks["n"].values
K = Ks["K"].values
Ks = Ks["Ks"].values

sand = infil.infiltrations["Sand"].values
silt = infil.infiltrations["Silt"].values
clay = infil.infiltrations["Clay"].values

KSS:dict[str, np.ndarray] = {
    "Ks": np.log10(Ks.astype(np.float32)), #type:ignore
}
for key, value in ALL_FUNCTIONS.items():
    KSS[key] = np.log10(value(sand, silt, clay))

# Largura de cada barra
width = 0.1

# Figura
fig1 = plt.figure(figsize=(14, 6))
ax1 = fig1.add_subplot(2, 1, 1) # 2 linhas, 1 colunas, posição 1
ax2 = fig1.add_subplot(2, 1, 2) # 2 linhas, 1 colunas, posição 2

x1 = np.arange(int(len(infil.infiltrations)/2))   # Posições X1
x2 = np.arange(len(infil.infiltrations)-len(x1))  # Posições X2

# Barras lado a lado
for i, (key, value) in enumerate(KSS.items()):

    ax1.bar(x1 + (i - (len(KSS)/2)) * width, value[x1], width, label=key)
    ax2.bar(x2 + (i - (len(KSS)/2)) * width, value[x1[-1]+x2+1],  width, label=key)

# Estética
ax1.set_title("Comparação de -log10(Ks [cm/s]) entre métodos", fontsize=14)

ax2.set_xlabel("Ponto", fontsize=12)

# ax1.set_ylabel("Condutividade hidráulica (Ks)", fontsize=12)
# ax2.set_ylabel("Condutividade hidráulica (Ks)", fontsize=12)

ax1.grid(axis='y', linestyle='--', alpha=0.6)
ax2.grid(axis='y', linestyle='--', alpha=0.6)

ax1.set_xticks(x1)
ax2.set_xticks(x2)

ax1.invert_yaxis()
ax2.invert_yaxis()

# ax1.set_ylim(top=0.003)
# ax2.set_ylim(top=0.003)

ax1.set_xticklabels(infil.infiltrations.loc[x1, "Ponto"], rotation=90)
ax2.set_xticklabels(infil.infiltrations.loc[(x1[-1]+x2+1), "Ponto"], rotation=90) #type: ignore

ax1.legend()


# Plot Soil Textures
# fig2 = plt.figure(figsize=(14, 6))
# ax2 = fig2.add_subplot(projection='ternary') # 2 linhas, 1 colunas, posição 2
# infil.plot_soil_texture(fig2, ax2, rotulos=True)

plt.tight_layout()
plt.show()
