import os
import geopandas as gpd

from math import ceil
from shapely.geometry import Point

from typing import Literal
from app.fastapi_types import Paginate
from sqlalchemy import create_engine, Column, func, Table, String, and_, or_
from sqlalchemy.orm import sessionmaker, declarative_base, Session, Query

# Cria o motor de conexão
engine = create_engine(os.getenv('DATABASE_URL'), connect_args={"check_same_thread": False})

# Cria uma fábrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para as classes do modelo
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Funções do Banco de dados
def paginate_query(table:Table, paginate:Paginate, db:Session):
    query = db.query(table)

    # Filtros
    if paginate.filter_by:
        for key, value in paginate.filter_by.items():
            # Filtro pelo BBOX ou separar as geometrias
            if key == "Geometry" or (key == "BBOXs" and isinstance(value, list)):
                query = _filter_bbox_or_geometry(query, table, key, value)
                continue

            column:Column = getattr(table, key)
            if isinstance(value, str) and "%" in value:
                query = query.filter(func.cast(column, String).ilike(value))
            else:
                query = query.filter(column == value)


    # Ordenação
    if paginate.order_by:
        columns:list[Column] = []
        
        if isinstance(paginate.order_by, list):
            for column in paginate.order_by:
                columns.append(getattr(table, column))
        else:
            columns.append(getattr(table, paginate.order_by))


        # Ordenando pela similaridade, TODO: Adicionar a extensão de similaridade no DB
        if hasattr(func, "similarity") and paginate.order is not None:
            new_columns = []
            for i, column in enumerate(columns):
                value = paginate.order
                if isinstance(paginate.order, list):
                    value = value[i]
                
                similarity = func.similarity(column, value)
                new_columns.append(similarity)
            columns = new_columns

        if paginate.order_in:
            new_columns = []
            for i, column in enumerate(columns):
                order = paginate.order_in
                if isinstance(order, list):
                    order = order[i]
                if order == "asc":
                    order = column.asc()
                elif order == "desc":
                    order = column.desc()
                new_columns.append(order)
            columns = new_columns

        query = query.order_by(*columns)

    # Calculando as páginas
    total_items = query.count()
    total_pages = ceil(total_items / paginate.per_page)

    (total_items + paginate.per_page - 1) // paginate.per_page,

    offset = (paginate.page - 1) * paginate.per_page
    values = query.offset(offset).limit(paginate.per_page).all()
    
    return {
        "items": values,
        "page": paginate.page,
        "per_page": paginate.per_page,
        "total_pages": total_pages,
        "total_items": total_items,
    }

def _filter_bbox_or_geometry(query:Query, table:Table, key:Literal["Geometry","BBOXs"]="BBOXs", value=[]):
    bboxs = []
    if key == "Geometry" and "features" in value:
        for feature in value["features"]:
            bboxs.append(feature.get("bbox", [0, 0, 0, 0]))
    else:
        bboxs = value

    if len(bboxs) == 0:
        return query

    colLatName = None
    colLngName = None

    latNames = ["lat", "Lat", "latitude", "Latitude"]
    for latName in latNames:
        if hasattr(table, latName):
            colLatName = latName
            break
    else:
        return query

    lonNames = ["lng", "lon", "Lng", "Lon", "longitude", "Longitude"]
    for lonName in lonNames:
        if hasattr(table, lonName):
            colLngName = lonName
            break
    else:
        return query

    colLat:Column = getattr(table, colLatName)
    colLng:Column = getattr(table, colLngName)

    filter = None
    for bbox in bboxs:
        and_val = and_(
            colLat >= bbox[1],
            colLat <= bbox[3],
            colLng >= bbox[0],
            colLng <= bbox[2]
        )
        if filter is None:
            filter = and_val
        else:
            filter = or_(filter, and_val)
            
    query = query.filter(filter)

    if query.count() == 0 or key == "BBOXs":
        return query
    
    possible_ids = ["RegistroID", "id", "ID"]
    column_id:Column|None = None
    for id in possible_ids:
        if hasattr(table, id):
            column_id:Column = getattr(table, id)
            break
    else:
        return query
    
    values = query.all()
    points = [{
        "id": getattr(val, id),
        "geometry": Point(
            getattr(val, colLngName),
            getattr(val, colLatName),
        )
    } for val in values]

    # Converta para GeoDataFrame
    gdf_points = gpd.GeoDataFrame(points, geometry="geometry")
    gdf_polygons = gpd.GeoDataFrame.from_features(value["features"])
    in_points = gpd.sjoin(
        gdf_points,
        gdf_polygons,
        how="inner",
        predicate="intersects"
    )

    ids = in_points.id.values.tolist()
    query = query.filter(column_id.in_(ids))
    return query


    
