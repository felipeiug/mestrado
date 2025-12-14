import os, tempfile
import rioxarray as rxr
from tqdm import tqdm
from rioxarray.merge import merge_arrays
from rasterio.env import Env

# === configurando o temp do GDAL ===
os.environ["GDAL_TMPDIR"] = "D:/APAGAR"
os.environ["CPL_TMPDIR"]  = "D:/APAGAR"
os.environ["TMPDIR"]       = "D:/APAGAR"
os.environ["TEMP"]         = "D:/APAGAR"
os.environ["TMP"]          = "D:/APAGAR"

tempfile.tempdir = "D:/APAGAR"

rasters = os.listdir("rasters")

rasters_readed = []

# === carregue TUDO em RAM ===
for raster in tqdm(rasters, desc="Lendo rasters"):
    rst = rxr.open_rasterio(f"rasters/{raster}", masked=True).load()
    rst = rst.rio.write_crs("EPSG:4326")
    rasters_readed.append(rst)

# === agora 1 merge ÚNICO ===
with Env(
    GDAL_TEMPDIR="D:/APAGAR",
    GDAL_CACHEMAX=4096  # 4GB in RAM
):
    mosaic = merge_arrays(rasters_readed)

# === Salvar ===
mosaic.rio.to_raster("mosaic_topodata.tif")



# # ======================================
# # EXEMPLO DE USO
# # ======================================
# urls = [
#     '14S525', '14S51_', '14S495', '14S48_', '14S465', '14S45_', '14S435', '14S42_', '14S405',
#     '15S525', '15S51_', '15S495', '15S48_', '15S465', '15S45_', '15S435', '15S42_', '15S405',
#     '16S525', '16S51_', '16S495', '16S48_', '16S465', '16S45_', '16S435', '16S42_', '16S405',
#     '17S525', '17S51_', '17S495', '17S48_', '17S465', '17S45_', '17S435', '17S42_', '17S405',
#     '18S525', '18S51_', '18S495', '18S48_', '18S465', '18S45_', '18S435', '18S42_', '18S405',
#     '19S525', '19S51_', '19S495', '19S48_', '19S465', '19S45_', '19S435', '19S42_', '19S405',
#     '20S525', '20S51_', '20S495', '20S48_', '20S465', '20S45_', '20S435', '20S42_', '20S405',
#     '21S525', '21S51_', '21S495', '21S48_', '21S465', '21S45_', '21S435', '21S42_', '21S405',
#     '22S525', '22S51_', '22S495', '22S48_', '22S465', '22S45_', '22S435', '22S42_', '22S405',
# ]

# urls = [f'http://www.dsr.inpe.br/topodata/data/geotiff/{i}ZN.zip' for i in urls]
