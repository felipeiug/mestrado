import os
import jwt

from sqlalchemy import and_
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, status

from app.models.database import get_db
from app.fastapi_types import ProjectType, FlowType, NodeType, EdgeType
from app.models import User, Project, Flow, Edge, Node

from typing import List
from datetime import datetime, timezone


from app.routes.login import get_current_user

project_route = APIRouter(prefix="/projects", tags=["Projects"])

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Não foi possível validar as credenciais",
    headers={"WWW-Authenticate": "Bearer"},
)
user_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Usuário não encontrado",
)
project_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Projeto não encontrado",
)
flow_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Fluxograma não encontrado",
)
node_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Nó não encontrado",
)
edge_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Edge não encontrado",
)

# Projetos
@project_route.get("/all", response_model=List[ProjectType])
async def get_projects(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    studies = db.query(Project).filter(Project.user == current_user.id).all()
    return [i.to_json(without_flow=True) for i in studies]


@project_route.get("/{id}", response_model=ProjectType)
async def get_project(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(Project).filter(and_(
        Project.id == id,
        Project.user == current_user.id,
    )).first()

    if not project:
        raise project_not_found_exception

    return project.to_json()


@project_route.post("", response_model=ProjectType)
async def add_project(
    new_project: ProjectType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    flow = Flow(insertDate = datetime.now(timezone.utc))
    db.add(flow)
    db.commit()
    db.refresh(flow)

    data = new_project.model_dump()

    data["flow_id"] = flow.id
    data['user'] = current_user.id
    data['insertDate'] = datetime.now(timezone.utc)

    data.pop("id", None)
    data.pop("flow", None)
    data.pop("updateDate", None)
    data.pop("updateBy", None)
    
    project = Project(**data)
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    return project.to_json()


@project_route.put("", response_model=ProjectType)
async def update_project(
    project_data: ProjectType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(and_(
        Project.id == project_data.id,
        Project.user == current_user.id,
    )).first()

    if not project:
        raise project_not_found_exception

    dados = project_data.model_dump()

    dados.pop("id", None)
    dados.pop("user", None)
    dados.pop("flow", None)
    dados.pop("insertDate", None)
    dados.pop("updateDate", None)
    dados.pop("updateBy", None)

    project.name = dados.pop("name", project.name)
    project.description = dados.pop("description", project.description)
    project.updateDate = datetime.now(timezone.utc)
    project.updateBy = current_user.id
        
    db.commit()
    db.refresh(project)
    
    return project.to_json(without_flow=True)


@project_route.delete("/{id}", response_model=ProjectType)
async def delete_project(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(and_(
        Project.id == id,
        Project.user == current_user.id,
    )).first()

    if not project:
        raise project_not_found_exception

    db.delete(project)
    db.commit()
    
    return project.to_json(without_flow=True)


# Fluxograma
@project_route.put("/flow", response_model=FlowType)
async def update_flow(
    flow_data: FlowType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    flow = db.query(Flow).filter(Flow.id == flow_data.id).first()

    if not flow:
        raise flow_not_found_exception
    
    if flow.project.user != current_user.id:
        raise flow_not_found_exception

    flow.style = flow_data.style
    flow.updateDate = datetime.now(timezone.utc)
    flow.updateBy = current_user.id
        
    db.commit()
    db.refresh(flow)
    
    return flow.to_json()


# Nós
@project_route.post("/node/{flow_id}", response_model=NodeType)
async def add_node(
    flow_id: int,
    new_node: NodeType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    flow:Flow = db.query(Flow).filter(Flow.id == flow_id).first()

    if not flow:
        raise flow_not_found_exception
    
    if flow.project.user != current_user.id:
        raise flow_not_found_exception
    
    data = {
        "id":      new_node.id,
        "flow_id": flow.id,
        'tipo':    new_node.tipo,
        "args":    new_node.args,
        "pos_x":   new_node.posX,
        "pos_y":   new_node.posY,
        'insertDate': datetime.now(timezone.utc),
    }
    node = Node(**data)

    db.add(node)
    db.commit()
    db.refresh(node)
    
    return node.to_json()


@project_route.put("/node/{node_id}", response_model=NodeType)
async def update_node(
    node_id: int,
    new_node: NodeType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    node:Node = db.query(Node).filter(Node.id == node_id).first()

    if not node:
        raise node_not_found_exception
    
    if node.flow.project.user != current_user.id:
        raise node_not_found_exception
    
    node.tipo = new_node.tipo
    node.args = new_node.args
    node.pos_x = new_node.posX
    node.pos_y = new_node.posY
    node.updateBy = current_user.id
    node.updateDate = datetime.now(timezone.utc)

    db.commit()
    db.refresh(node)
    
    return node.to_json()


@project_route.delete("/node/{node_id}", response_model=NodeType)
async def delete_node(
    node_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    node:Node = db.query(Node).filter(Node.id == node_id).first()

    if not node:
        raise node_not_found_exception
    
    if node.flow.project.user != current_user.id:
        raise node_not_found_exception

    db.delete(node)
    db.commit()
    db.refresh(node)
    
    return node.to_json()


# Edges
@project_route.post("/edge/{flow_id}", response_model=EdgeType)
async def add_edge(
    flow_id: int,
    new_edge: EdgeType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    flow:Flow = db.query(Flow).filter(Flow.id == flow_id).first()

    if not flow:
        raise flow_not_found_exception
    
    if flow.project.user != current_user.id:
        raise flow_not_found_exception

    data = {
        "id":      new_edge.id,
        "flow_id": flow.id,
        'source':  new_edge.source,
        "target":  new_edge.target,
        "args":    new_edge.args,
        'insertDate': datetime.now(timezone.utc),
    }
    edge = Edge(**data)

    db.add(edge)
    db.commit()
    db.refresh(edge)
    
    return edge.to_json()


@project_route.put("/edge/{edge_id}", response_model=EdgeType)
async def update_edge(
    edge_id: int,
    new_edge: EdgeType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    edge:Edge = db.query(Edge).filter(Edge.id == edge_id).first()

    if not edge:
        raise edge_not_found_exception
    
    if edge.flow.project.user != current_user.id:
        raise edge_not_found_exception
    
    edge.source = new_edge.source
    edge.target = new_edge.target
    edge.args = new_edge.args
    edge.updateBy = current_user.id
    edge.updateDate = datetime.now(timezone.utc)

    db.commit()
    db.refresh(edge)
    
    return edge.to_json()


@project_route.delete("/edge/{edge_id}", response_model=EdgeType)
async def delete_node(
    edge_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    edge:Edge = db.query(Edge).filter(Edge.id == edge_id).first()

    if not edge:
        raise edge_not_found_exception
    
    if edge.flow.project.user != current_user.id:
        raise edge_not_found_exception

    db.delete(edge)
    db.commit()
    db.refresh(edge)
    
    return edge.to_json()
