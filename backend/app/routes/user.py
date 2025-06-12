import os
import jwt

from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import APIRouter, Depends

from app.models.database import get_db
from app.fastapi_types import UserType
from app.models import User
from pydantic import BaseModel
from typing import Optional, List

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import PyJWTError
from datetime import datetime, timedelta, timezone


from app.models.database import get_db, paginate_query
from app.models import User
from app.utils import generate_random_hash
from app.utils.email_sender import send_code_reset_password
from app.routes.login import get_current_user
from app.fastapi_types.paginate import Paginate

user_route = APIRouter(prefix="/user", tags=["User"])

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Não foi possível validar as credenciais",
    headers={"WWW-Authenticate": "Bearer"},
)
user_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Usuário não encontrado",
)


# Rota para obter os dados do usuário
@user_route.get("", response_model=UserType)
async def get_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user.to_json()

@user_route.put("", response_model=UserType)
async def update_user(
    user_data: UserType,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    if user_data.name and user_data.name != current_user.name:
        current_user.name = user_data.name
        
    db.commit()
    db.refresh(current_user)
    
    return current_user.to_json()
    
# Get user By ID
@user_route.get("/{user_id}", response_model=UserType)
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.admin:
        raise credentials_exception

    # Agora podemos usar o db para buscar o usuário
    db_user = db.query(User).filter(User.id == user_id).first()
    
    if not db_user:
        raise user_not_found_exception
        
    # Convertendo o modelo do SQLAlchemy para o modelo Pydantic
    return db_user.to_json()


class AllUsers(BaseModel):
    items: List[UserType]
    page: int
    perPage: int
    totalPages: int
    totalItems: int
@user_route.get("/all/{page}/{per_page}", response_model=AllUsers)
async def get_all_users(
    paginate: Paginate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.admin:
        raise credentials_exception
    
    return paginate_query(User, paginate, db)

