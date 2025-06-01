import os
import jwt

from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import APIRouter, Depends

from app.models.database import get_db
from app.fastapi_types import *
from app.models import User
from pydantic import BaseModel

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import PyJWTError
from datetime import datetime, timedelta, timezone


from app.models.database import get_db
from app.models import User

login_route = APIRouter(prefix="/login", tags=["Login"])

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Não foi possível validar as credenciais",
    headers={"WWW-Authenticate": "Bearer"},
)
user_not_found_exception = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Usuário não encontrado",
)

# Configuração do OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Função para criar o token JWT
async def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", '30')))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm="HS256")
    return encoded_jwt

# Função para obter o usuário atual
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db))->User:
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Rota de login
class Login(BaseModel):
    email: str
    password: str
@login_route.post("")
async def login(form_data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == form_data.email) &
        (User.status == True)
    ).first()
    if not user or not user.check_password(form_data.password):
        raise credentials_exception
    
    db.commit()
    db.refresh(user)

    access_token = await create_access_token({"sub": user.email})
    return {"token": access_token, "token_type": "bearer"}

