import numpy as np

from soiltexture import getTextures, getTexture
from collections.abc import Iterable

def _is_iterable(var):
    return isinstance(var, (Iterable, np.ndarray)) and not isinstance(var, (str, bytes))

def calculate_soil_type(sand:list[float|int]|np.ndarray|float|int, clay:list[float|int]|np.ndarray|float|int, return_index=False)->np.ndarray:
    """Calcula o tipo de solo com base nos teores de Area, Silte e Argila, a classificação é no padrão USDA"""

    # 0=none
    # 1=clay
    # 2=silty clay
    # 3=silty clay loam
    # 4=sandy clay 
    # 5=sandy clay loam
    # 6=clay loam
    # 7=silt
    # 8=silt loam
    # 9=loam
    # 10=sand 
    # 11=loamy sand
    # 12=sandy loam
    # 13=silt loam

    is_list = _is_iterable(sand) and _is_iterable(clay)

    if not _is_iterable(sand):
        sand = [sand]
    if not _is_iterable(clay):
        clay = [clay]

    textures:list[str] = getTextures(sand, clay, classification='USDA')

    if return_index:
        idexes = {
            None:0,
            "clay":1,
            "silty clay":2,
            "silty clay loam":3,
            "sandy clay":4,
            "sandy clay loam":5,
            "clay loam":6,
            "silt":7,
            "silt loam":8,
            "loam":9,
            "sand":10,
            "loamy sand":11,
            "sandy loam":12,
            "silt loam":13,
        }

        map_texture = np.vectorize(lambda t: idexes.get(t.lower() if t is not None else None, 0))

        if not is_list:
            return idexes[textures[0].title()]
        return map_texture(textures)



    if not is_list:
        return textures[0].title()
    return np.array([i.title() for i in textures])

    