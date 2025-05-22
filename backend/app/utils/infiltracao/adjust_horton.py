import os
os.system("cls")

import json
import numpy as np
import pandas as pd

import pyswarms as ps

def horton(t, fo, fc, k):
    '''Retorna o valor da curva de infiltração pela equação de Horton para um dado valor de `fc`, `fo`, `Fc` e `t`
    Onde:

    - fc é a taxa de infiltração final (cm/h)
    - fo é a taxa de infiltração inicial (cm/h)
    - k é o decaimento da curva h^-1
    '''
    return fc+(fo-fc)*np.exp(-k*t)

def FO(X, Iobs, t):
    erros = []

    fo = X[:, 0]
    fc = X[:, 1]
    k  = X[:, 2]

    Iest = horton(t[:, np.newaxis], fo, fc, k)
    
    erros = np.mean(np.sqrt(np.pow(Iobs[:, np.newaxis] - Iest, 2)), axis=0)
    erros = np.where(np.isnan(erros) | np.isinf(erros), 1E12, erros)

    return erros

def adjust_horton(I, t, N_particulas=10000, N_iteracoes=10000, c1=1.5, c2=1.2, w=0.8):

    # Bounds
    bounds = (
        [   # MIN
            I[0], # fo
            0,    # fc
            0,    # k
        ],
        [   # MAX
            I[0]*100,   # fo
            np.mean(I), # fc
            +4,         # k
        ],
    )

    ############# RUN ############################################################

    # Create a model
    N_variaveis = 3
    options = {
        "c1": c1,
        "c2": c2,
        "w": w,
    }

    print("Criando Otimizador")
    optimizer = ps.single.GlobalBestPSO(
        n_particles=N_particulas,
        dimensions=N_variaveis,
        options=options,
        bounds=bounds
    )

    print("Otimizando")
    _, pos = optimizer.optimize(
        FO,
        verbose=True,
        iters=N_iteracoes,
        Iobs=I,
        t=t,
    )

    print("Dados Simulados")
    params = {
        "fo": float(pos[0]),
        "fc": float(pos[1]),
        "k":  float(pos[2]),
    }

    return params

