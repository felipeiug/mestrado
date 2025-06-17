from typing import Optional, List, Dict
from pydantic import BaseModel

class EdgeType(BaseModel):
    id: str
    source: str
    target: str
    insertDate: str
    args: Optional[Dict] = None
    updateDate: Optional[str] = None
    updateBy: Optional[str] = None

class NodeType(BaseModel):
    id: str
    tipo: str
    args: Optional[Dict] = None
    posX: float
    posY: float
    insertDate: str
    updateDate: Optional[str] = None
    updateBy: Optional[str] = None

class FlowType(BaseModel):
    id: int
    style: Optional[dict] = None
    nodes: List[NodeType]
    edges: List[EdgeType]
    insertDate: str
    updateDate: Optional[str] = None
    updateBy: Optional[str] = None

class ProjectType(BaseModel):
    id: int
    name: str
    user: str
    description: Optional[str] = None
    flow: Optional[FlowType] = None
    insertDate: str
    updateDate: Optional[str] = None
    updateBy: Optional[str] = None

