import numpy as np

from soiltexture import getTextures, getTexture
from collections.abc import Iterable

def _is_iterable(var):
    return isinstance(var, (Iterable, np.ndarray)) and not isinstance(var, (str, bytes))

def calculate_soil_type(sand:list[float|int]|np.ndarray|float|int, clay:list[float|int]|np.ndarray|float|int):
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

    if not is_list:
        return textures[0].title()
    return np.array([(i.title() if i is not None else None) for i in textures])

    