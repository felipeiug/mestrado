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
}