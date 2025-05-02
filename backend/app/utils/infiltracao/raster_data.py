import numpy as np
import xarray as xr
import rioxarray

from shapely import Point

class GenerateRaster:

    def __init__(self, resolution:float, bbox:tuple[float, float, float, float], crs:str):
        """Para uma resolução, em m, um bbox para os limites e a projeção, criará um raster para os dados"""
        x = np.arange(bbox[0], bbox[2], resolution)  # Coordenadas x (lon)
        y = np.arange(bbox[1], bbox[3], resolution)  # Coordenadas y (lat)
        self.crs = crs

        data = np.zeros((len(y), len(x)))
        self.raster = xr.DataArray(
            data,
            coords={"y": y, "x": x},
            dims=["y", "x"],
        )
        self.raster.rio.write_crs(crs, inplace=True)

    def generate_invlin(self, points:np.ndarray, max_dist: float|None = None, null_values:float = -1):
        band = self.raster
        x_coords, y_coords = band['x'].values, band['y'].values

        null_raster = self.raster.copy(deep=True)
        null_raster.data[...] = null_values

        for index_y in range(self.raster.shape[0]):  # Para cada linha
            points_x:np.ndarray = np.array([x_coords[index_x] for index_x in range(self.raster.shape[1])])
            points_y:np.ndarray = np.array([y_coords[index_y]]*self.raster.shape[1])

            dif_x = points_x[:, np.newaxis]-points[:, 0]
            dif_y = points_y[:, np.newaxis]-points[:, 1]

            distancias = np.hypot(dif_x, dif_y)

            if max_dist is not None:
                mask_dist = (distancias <= max_dist)
                distancias = np.where(mask_dist, distancias, 0)

            multi_media = 1/distancias
            multi_media[np.isinf(multi_media)] = 0

            div_media = np.sum(multi_media, axis=1)
            na_medio = np.sum(points[:, 2] * multi_media, axis=1)/div_media

            na_medio = np.nan_to_num(
                na_medio,
                nan=null_values,
                posinf=null_values,
                neginf=null_values
            )

            null_raster.values[index_y] = na_medio

        return null_raster
    
    def save(self, raster:xr.DataArray, path:str):
        raster.rio.to_raster(path)