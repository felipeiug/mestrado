import geopandas as gpd
gpd.options.io_engine = "pyogrio"

from .infiltracao import *
from .consts import *