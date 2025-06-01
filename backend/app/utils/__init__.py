import geopandas as gpd
gpd.options.io_engine = "pyogrio"

from .infiltracao import *
from .consts import *
from app.utils.generate_random import generate_random_hash