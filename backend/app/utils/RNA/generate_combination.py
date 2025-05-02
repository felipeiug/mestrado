import itertools

import torch

def generate_combinations(
    layers_step: int = 4,
    min_layers: int = 8,
    max_layers: int = 128,
    neuronios_step: int = 8,
    min_neuronios: int = 32,
    max_neuronios: int = 256,
):
    combinations = []
    for layers in range(min_layers, max_layers+1, layers_step):
        rna_combination = []
        for layer in range(layers):
            for neuronios in range(min_neuronios, max_neuronios+1, neuronios_step):
                rna_combination.append()