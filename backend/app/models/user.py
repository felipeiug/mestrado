from app.models.database import Base
from app.models.helper import AuditoriaTable
from app.fastapi_types import UserType

import uuid
from sqlalchemy import (
    Boolean, Column, DateTime, String
)
from passlib.context import CryptContext
from sqlalchemy.dialects.postgresql import UUID

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(AuditoriaTable, Base):
    __tablename__ = "users"

    # Identificação
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    # Controle de acesso
    admin = Column(Boolean, nullable=False, default=False)
    status = Column(Boolean, nullable=False, default=True)

    # Verificações
    validEmail = Column(Boolean, nullable=False, default=False)
    universityId = Column(String, nullable=True)
    universityValid = Column(Boolean, nullable=True)

    # Senha
    passwHash = Column(String, nullable=True, unique=True)
    lastResetPassword = Column(DateTime(timezone=True), nullable=True)
    resetPasswordCode = Column(String, nullable=True)

    def generate_initial_password(self):
        """
        Gera a senha inicial a partir dos dois primeiros caracteres de cada parte do UUID.
        Exemplo:
            UUID = '99e2c672-9b85-4a5c-97f5-231a1859be78'
            Senha inicial gerada = "999b4a9723"
        """
        # Garante que o id já esteja definido
        if not self.id:
            raise ValueError("ID do usuário ainda não foi definido.")
        partes = [parte[:2] for parte in str(self.id).split('-')]
        return ''.join(partes)
    
    def set_password(self, password:str)->str:
        self.passwHash = pwd_context.hash(password)
        
    def check_password(self, password):
        # Criando a senha com base no ID do usuário, quando ele for criado ainda sem senha.
        # Senha inicial é, no caso do ID '99e2c672-9b85-4a5c-97f5-231a1859be78'
        # Os 2 primeiros digitos que vem no ínicio ou após '-'
        # 999b4a9723 no exemplo a cima
        if self.passwHash is None or self.passwHash == "":
            caracteres = [i[0:2] for i in str(self.id).split('-')]
            self.passwHash = pwd_context.hash("".join(caracteres))

        return pwd_context.verify(password, self.passwHash)

    def to_json(self):
        return UserType({
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'admin': self.admin,
            'status': self.status,
            'validEmail': self.validEmail,
            'universityId': self.universityId,
            'universityValid': self.universityValid,
            'lastResetPassword': self.lastResetPassword.isoformat() if self.lastResetPassword is not None else None,
            'resetPasswordCode': self.resetPasswordCode,
            'lastLogin': self.lastLogin.isoformat() if self.lastLogin is not None else None,
            'updateDate': self.updateDate.isoformat() if self.updateDate is not None else None,
            'insertDate': self.insertDate.isoformat(),
            'updateBy': self.updateBy,
        })


