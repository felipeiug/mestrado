from app.models.database import Base
from app.models.helper import AuditoriaTable

import uuid
from sqlalchemy import (
    Boolean, Column, DateTime, String
)
from passlib.context import CryptContext
from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy import Column, Integer, String, Text, Float, Enum, ForeignKey, JSON
from sqlalchemy.orm import relationship

class Project(AuditoriaTable, Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True, unique=True, nullable=False)
    user = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    flow_id = Column(Integer, ForeignKey('flows.id', ondelete='CASCADE'), nullable=False)

    flow = relationship("Flow")
    
    def to_json(self, without_flow=False):
        data =  {
            "id": self.id,
            "user": str(self.user),
            "name": self.name,
            'description': self.description,
            'updateDate': self.updateDate.isoformat() if self.updateDate is not None else None,
            'insertDate': self.insertDate.isoformat(),
            'updateBy': self.updateBy,
        }

        if not without_flow:
            data['flow'] = self.flow.to_json()

        return data


class Flow(AuditoriaTable, Base):
    __tablename__ = 'flows'
    id = Column(Integer, primary_key=True, unique=True, nullable=False)

    nodes = relationship("Node", back_populates="flow",
                         cascade="all, delete-orphan",
                         passive_deletes=True)
    
    edges = relationship("Edge", back_populates="flow",
                         cascade="all, delete-orphan",
                         passive_deletes=True)
    
    def to_json(self):
        return {
            "id": self.id,
            'nodes': [i.to_json() for i in self.nodes],
            'edges': [i.to_json() for i in self.edges],
            'updateDate': self.updateDate.isoformat() if self.updateDate is not None else None,
            'insertDate': self.insertDate.isoformat(),
            'updateBy': self.updateBy,
        }


class Node(AuditoriaTable, Base):
    __tablename__ = 'nodes'
    id = Column(String, primary_key=True, unique=True, nullable=False)
    flow_id = Column(Integer, ForeignKey('flows.id', ondelete='CASCADE'), nullable=False)
    tipo = Column(Text, nullable=False)
    args = Column(JSON, nullable=True)
    pos_x = Column(Float, nullable=False)
    pos_y = Column(Float, nullable=False)

    flow = relationship("Flow", back_populates="nodes")
    
    def to_json(self):
        return {
            "id": self.id,
            'flowId': self.flow_id,
            "tipo": self.tipo,
            "args": self.args,
            "posX": self.pos_x,
            "posY": self.pos_y,
            'updateDate': self.updateDate.isoformat() if self.updateDate is not None else None,
            'insertDate': self.insertDate.isoformat(),
            'updateBy': self.updateBy,
        }


class Edge(AuditoriaTable, Base):
    __tablename__ = 'edges'
    id = Column(String, primary_key=True)
    source = Column(String, nullable=False)
    target = Column(String, nullable=False)
    flow_id = Column(Integer, ForeignKey('flows.id', ondelete='CASCADE'), nullable=False)
    
    flow = relationship("Flow", back_populates="edges")
    
    def to_json(self):
        return {
            "id": self.id,
            'flowId': self.flow_id,
            'source': self.source,
            "target": self.target,
            'updateDate': self.updateDate.isoformat() if self.updateDate is not None else None,
            'insertDate': self.insertDate.isoformat(),
            'updateBy': self.updateBy,
        }
