import numpy as np

USO_SOLO_CLASS = {
    0: {
        "name": "No Data",
        "cor": "#000000",
        "infiltration_index":np.nan,
    },
    1: {
        "name":"Canga",
        "cor": "#becd47",
        "infiltration_index":2,
    },
    2: {
        "name":"Vegetação Rasteira",
        "cor": "#9bec9c",
        "infiltration_index":5,
    },
    3: {
        "name":"Industrial",
        "cor": "#8c1727",
        "infiltration_index":1,
    },
    4: {
        "name":"Residencial",
        "cor": "#d35625",
        "infiltration_index":1,
    },
    5: {
        "name":"Vegetação Densa",
        "cor": "#236628",
        "infiltration_index":7,
    },
    6: {
        "name":"Solo Exposto",
        "cor": "#fff500",
        "infiltration_index":3,
    },
    7: {
        "name":"Água",
        "cor": "#1a98ff",
        "infiltration_index":8,
    },
    8: {
        "name":"Pousio",
        "cor": "#ec8de7",
        "infiltration_index":6,
    },
    9: {
        "name":"Agricultura",
        "cor": "#d009cd",
        "infiltration_index":4,
    },
    10: {
        "name":"10",
        "cor": "#4c4c4c",
        "infiltration_index":np.nan,
    },
    11: {
        "name":"11",
        "cor": "#7a7a7a",
        "infiltration_index":np.nan,
    },
    12: {
        "name":"12",
        "cor": "#a0a0a0",
        "infiltration_index":np.nan,
    },
    13: {
        "name":"13",
        "cor": "#b7b7b7",
        "infiltration_index":np.nan,
    },
    14: {
        "name":"14",
        "cor": "#D3D3D3",
        "infiltration_index":np.nan,
    },
    15: {
        "name":"No Data",
        "cor": "#f7f7f7",
        "infiltration_index":np.nan,
    },
}

USO_SOLO_MAPBIOMAS = {
    0: {"name": "No Data", "cor": "#000000", "infiltration_index":np.nan},
    1: {"name": "Floresta", "color": "#1f8d49", "infiltration_index": 9},
    3: {"name": "Formação Florestal", "color": "#1f8d49", "infiltration_index": 9},
    4: {"name": "Formação Savânica", "color": "#7dc975", "infiltration_index": 8},
    5: {"name": "Mangue", "color": "#04381d", "infiltration_index": 6},
    6: {"name": "Floresta Alagável", "color": "#007785", "infiltration_index": 7},
    49: {"name": "Restinga Arbórea", "color": "#02d659", "infiltration_index": 7},

    10: {"name": "Vegetação Herbácea e Arbustiva", "color": "#d6bc74", "infiltration_index": 6},
    11: {"name": "Campo Alagado e Área Pantanosa", "color": "#519799", "infiltration_index": 5},
    12: {"name": "Formação Campestre", "color": "#d6bc74", "infiltration_index": 6},
    32: {"name": "Apicum", "color": "#fc8114", "infiltration_index": 2},
    29: {"name": "Afloramento Rochoso", "color": "#ffaa5f", "infiltration_index": 1},
    50: {"name": "Restinga Herbácea", "color": "#ad5100", "infiltration_index": 5},

    14: {"name": "Agropecuária", "color": "#ffefc3", "infiltration_index": 4},
    15: {"name": "Pastagem", "color": "#edde8e", "infiltration_index": 4},
    18: {"name": "Agricultura", "color": "#E974ED", "infiltration_index": 3},
    19: {"name": "Lavoura Temporária", "color": "#C27BA0", "infiltration_index": 3},
    39: {"name": "Soja", "color": "#f5b3c8", "infiltration_index": 3},
    20: {"name": "Cana", "color": "#db7093", "infiltration_index": 3},
    40: {"name": "Arroz", "color": "#c71585", "infiltration_index": 3},
    62: {"name": "Algodão", "color": "#ff69b4", "infiltration_index": 3},
    41: {"name": "Outras Lavouras Temporárias", "color": "#f54ca9", "infiltration_index": 3},

    36: {"name": "Lavoura Perene", "color": "#d082de", "infiltration_index": 4},
    46: {"name": "Café", "color": "#d68fe2", "infiltration_index": 5},
    47: {"name": "Citrus", "color": "#9932cc", "infiltration_index": 5},
    35: {"name": "Dendê", "color": "#9065d0", "infiltration_index": 4},
    48: {"name": "Outras Lavouras Perenes", "color": "#e6ccff", "infiltration_index": 4},

    9: {"name": "Silvicultura", "color": "#7a5900", "infiltration_index": 4},
    21: {"name": "Mosaico de Usos", "color": "#ffefc3", "infiltration_index": 3},

    22: {"name": "Área não Vegetada", "color": "#d4271e", "infiltration_index": 1},
    23: {"name": "Praia, Duna e Areal", "color": "#ffa07a", "infiltration_index": 1},
    24: {"name": "Área Urbanizada", "color": "#d4271e", "infiltration_index": 1},
    30: {"name": "Mineração", "color": "#9c0027", "infiltration_index": 1},
    75: {"name": "Usina Fotovoltaica", "color": "#c12100", "infiltration_index": 1},
    25: {"name": "Outras Áreas não Vegetadas", "color": "#db4d4f", "infiltration_index": 1},

    26: {"name": "Corpo D'água", "color": "#2532e4", "infiltration_index": 1},
    33: {"name": "Rio, Lago e Oceano", "color": "#2532e4", "infiltration_index": 1},
    31: {"name": "Aquicultura", "color": "#091077", "infiltration_index": 1},

    27: {"name": "Não Observado", "color": "#ffffff", "infiltration_index": 1}
}


COLUMNS_INFILTRATION = [
    "Ponto", "Lat", "Lon", "Alt", "00_00", "00_30", "01_00", "01_30", "02_00", "02_30", "03_00", "03_30", "04_00",
    "04_30", "05_00", "05_30", "06_00", "06_30", "07_00", "07_30", "08_00", "08_30", "09_00",
    "09_30", "10_00", "Clay", "Sand", "Silt", "Suction"
]

# Textura
SOIL_TYPES = {
    0: {
        "name": None,
        "infiltration_index": np.nan,
    },
    1: {
        "name": "clay",
        "infiltration_index": 1,
    },
    2: {
        "name": "silty clay",
        "infiltration_index": 2,
    },
    3: {
        "name": "silty clay loam",
        "infiltration_index": 3,
    },
    4: {
        "name": "sandy clay",
        "infiltration_index": 4,
    },
    5: {
        "name": "sandy clay loam",
        "infiltration_index": 5,
    },
    6: {
        "name": "clay loam",
        "infiltration_index": 5,
    },
    7: {
        "name": "silt",
        "infiltration_index": 4,
    },
    8: {
        "name": "silt loam",
        "infiltration_index": 6,
    },
    9: {
        "name": "loam",
        "infiltration_index": 7,
    },
    10: {
        "name": "sand",
        "infiltration_index": 9,
    },
    11: {
        "name": "loamy sand",
        "infiltration_index": 8,
    },
    12: {
        "name": "sandy loam",
        "infiltration_index": 7,
    },
    13: {
        "name": "silt loam 2",
        "infiltration_index": 6,
    },
    14: {
        "name": "other",
        "infiltration_index": 0,
    },
    15: {
        "name": "water",
        "infiltration_index": 9,
    },
    16: {
        "name": "urban",
        "infiltration_index": 1,
    },
    17: {
        "name": "rock",
        "infiltration_index": 1,
    },
}