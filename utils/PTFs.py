import numpy as np
from rosetta import rosetta, SoilData


def WMssc(sand, silt, clay):
    """ --------------------------------------
     Função WMssc por Ottoni et al. (2019)
     Entrada: %areia, %silte, %argila
    --------------------------------------"""
    log10_Ks = 2.039 - 0.00874 * silt - 0.00723 * clay
    Ks = np.pow(10, log10_Ks)   # cm/dia
    Ks = Ks / 86400.0           # cm/s
    return Ks

def COSBY(sand, silt, clay):
    """ --------------------------------------
     Função COSBY por Cosby et al. (1984)
     Entrada: %areia, %silte, %argila
    --------------------------------------"""
    # sand = sand/100
    # clay = clay/100

    log10_Ks = -0.6 + (0.0126 * sand) - (0.0064 * clay)
    Ks = 60.96 * np.pow(10, log10_Ks)   # cm/dia
    Ks = Ks / 86400.0                   # cm/s
    return Ks

def ROssc(sand, silt, clay):
    """ --------------------------------------
     Função ROssc por Schaap et al. (2001)
     Utiliza o ROSETTA
     Entrada: %areia, %silte, %argila
    --------------------------------------"""
    sand = np.atleast_1d(sand)
    silt = np.atleast_1d(silt)
    clay = np.atleast_1d(clay)

    if not (sand.shape == silt.shape == clay.shape):
        raise ValueError("sand, silt e clay devem ter o mesmo tamanho.")
    
    data = np.stack([sand, silt, clay], axis=1)

    mean, _, _ = rosetta(3, SoilData.from_array(data))
    log10_Ks = mean[:, 4]
    Ks = np.pow(10, log10_Ks)   # cm/dia
    Ks = Ks / 86400.0           # cm/s
    return Ks

def JULIA(sand, silt, clay):
    """ --------------------------------------
     Função JULIA por JULIÀ et al. (2004)
     Entrada: %areia, %silte, %argila
    --------------------------------------"""
    Ks = 2.208*np.exp(0.0491*sand) # cm/dia
    Ks = Ks / 86400.0              # cm/s
    return Ks

def Puckett(sand, silt, clay):
    """ --------------------------------------
     Função de Puckett por Puckett et al. (1985)
     Entrada: %areia, %silte, %argila
    --------------------------------------"""

    Ks = 376.704 * np.exp(-0.1975*clay) # cm/hr
    Ks = Ks / 86400.0                   # cm/s
    return Ks

def DanePuckett(sand, silt, clay):
    """ --------------------------------------
     Função de Dane & Puckett (1994)
     Entrada: %areia, %silte, %argila
    --------------------------------------"""

    Ks = 729.216 * np.exp(-0.144*clay) # cm/dia
    Ks = Ks / 86400.0                   # cm/s
    return Ks

def Saxton(sand, silt, clay):
    """ --------------------------------------
     Função de Saxton et al. (1986)
     Importante: θs também estimado!
     Entrada: %areia, %silte, %argila
    --------------------------------------
    """


    t1 = 12.01 - (0.0755*sand)
    t2 = (-3.8950 + (0.03671*sand) - (0.1103*clay) + 8.7546 * (10**(-4))*np.pow(clay, 2))

    # Obtendo Teta_s
    sand = np.atleast_1d(sand)
    silt = np.atleast_1d(silt)
    clay = np.atleast_1d(clay)

    if not (sand.shape == silt.shape == clay.shape):
        raise ValueError("sand, silt e clay devem ter o mesmo tamanho.")
    
    data = np.stack([sand, silt, clay], axis=1)

    mean, _, _ = rosetta(3, SoilData.from_array(data))
    teta_s = mean[:, 1]
    t2 = t2/teta_s

    Ks = 2.778 * (10**-6) * np.exp(t1 + t2) # cm/h
    Ks = Ks / 3600.0                        # cm/s
    
    return Ks

ALL_FUNCTIONS = {
    "WMssc": WMssc,
    "COSBY": COSBY,
    "ROssc": ROssc,
    "JULIA": JULIA,
    "Puckett": Puckett,
    "DanePuckett": DanePuckett,
    "Saxton":Saxton,
}