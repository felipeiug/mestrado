from sqlalchemy import (
    Column, DateTime, ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

class AuditoriaTable:
    lastLogin = Column(DateTime(timezone=True), nullable=True)
    insertDate = Column(DateTime(timezone=True), nullable=False, default=func.now())
    updateDate = Column(DateTime(timezone=True), nullable=True, onupdate=func.now())
    updateBy = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)