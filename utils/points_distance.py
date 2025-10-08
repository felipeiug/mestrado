import numpy as np
import pandas as pd
from shapely.geometry import Point


def points_distance(infiltrations:pd.DataFrame, initial_point=None):
    points:list[Point] = infiltrations.apply(lambda row: Point(row["Lon"], row["Lat"]), axis=1).values

    medias = _mean_dist(infiltrations)
    infiltrations["distancia_media"] = medias


    idx_max = initial_point or infiltrations["distancia_media"].idxmax()

    infiltrations["dist_position"] = None
    infiltrations.at[idx_max, "dist_position"] = 1

    while True:
        mask = infiltrations["dist_position"].isnull()

        if not mask.any():
            break

        points_calc = points[~mask]
        medias = _mean_dist(infiltrations[mask], points_calc)
        
        infiltrations.loc[~mask, "distancia_media"] = 0
        infiltrations.loc[mask, "distancia_media"] = medias

        idx_max = infiltrations["distancia_media"].idxmax()
        infiltrations.at[idx_max, "dist_position"] = np.sum(~mask)+1



    infiltrations.pop("distancia_media")
    return infiltrations.pop("dist_position").astype(np.int32)

def _mean_dist(infiltrations:pd.DataFrame, points_calc = None):
    points:list[Point] = infiltrations.apply(lambda row: Point(row["Lon"], row["Lat"]), axis=1).values
    points2:list[Point] = points_calc if points_calc is not None else points
    
    medias = np.zeros(len(points))
    for i in range(len(points)):
        dists = np.array([])
        point = points[i]
        for j in range(len(points2)):
            distance = point.distance(points2[j])
            dists = np.append(dists, distance)
        
        medias[i] = np.mean(np.pow(0.5, -dists))

    return medias
