import os
import jwt

from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import APIRouter, Depends

from app.models.database import get_db
from app.fastapi_types import UserType
from app.models import User
from pydantic import BaseModel
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import PyJWTError
from datetime import datetime, timedelta, timezone


from app.models.database import get_db
from app.models import User
from app.utils import generate_random_hash

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
new_user_exception = HTTPException(
    status_code=status.HTTP_406_NOT_ACCEPTABLE,
    detail="Não foi possível criar o usuário",
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
    
    user.lastLogin = datetime.now(timezone.utc)

    db.commit()
    db.refresh(user)

    access_token = await create_access_token({"sub": user.email})
    return {"token": access_token, "token_type": "bearer"}


@login_route.get("/logout")
async def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # TODO: Lógica de logout
    print(current_user)


class ResetCode(BaseModel):
    email: str
@login_route.post("/send_reset_code")
async def send_reset_code(form_data: ResetCode, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == form_data.email) &
        (User.status == True)
    ).first()
    if not user:
        raise user_not_found_exception

    code = generate_random_hash(8)

    # TODO: Adicionar o SMTP
    print(f"O código para resetar a senha de {form_data.email} é {code}")

    user.resetPasswordCode = code
    db.commit()

    return {'ok': True}


class ResetPassw(BaseModel):
    token: str
    password: str
@login_route.post("/change_password")
async def change_passw(form_data: ResetPassw, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.resetPasswordCode == form_data.token) &
        (User.status == True)
    ).first()
    if not user:
        raise user_not_found_exception

    user.resetPasswordCode = None
    user.lastResetPassword = datetime.now(timezone.utc)
    user.lastLogin = datetime.now(timezone.utc)
    user.set_password(form_data.password)
    
    db.commit()
    db.refresh(user)

    access_token = await create_access_token({"sub": user.email})

    return {"token": access_token, "token_type": "bearer"}


class UserWithPasswords(UserType):
    password: str
    confirmPassword: Optional[str]
@login_route.post("/new")
async def new_user(form_data: UserWithPasswords, db: Session = Depends(get_db)):
    error = new_user_exception
    
    if form_data.password != form_data.confirmPassword:
        error.detail = "As senhas não são iguais"
        raise error

    user_data = form_data.model_dump()

    passw = user_data.pop('password')

    user_data['admin'] = False
    user_data['status'] = True
    user_data['validEmail'] = False

    user_data.pop('confirmPassword', None)
    user_data.pop('insertDate', None)
    user_data.pop('lastLogin', None)
    user_data.pop('updateDate', None)
    user_data.pop('updateBy', None)
    user_data.pop('lastResetPassword', None)
    user_data.pop('resetPasswordCode', None)

    try:
        user = User(**user_data)
        
        db.commit()
        db.refresh(user)
    except Exception as e:
        error.detail = f"Erro ao adicionar usuário: {e}"
        db.rollback()

    try:
        user.set_password(passw)
        user.lastLogin = datetime.now(timezone.utc)

        db.commit()
        db.refresh(user)
    except Exception as e:
        error.detail = f"Erro ao adicionar usuário: {e}"
        db.rollback()

    access_token = await create_access_token({"sub": user.email})
    
    return {"token": access_token, "token_type": "bearer"}


