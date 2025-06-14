# from app.start_infiltrometro import *
# exit(0)

# %% Variáveis de ambiente
import os
os.system('cls' if os.name == 'nt' else 'clear')

from dotenv import load_dotenv
load_dotenv(override=True)

# %% Configurando o FastApi
from app import routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# %% Inicializando o FastApi
app = FastAPI(title="Neuro Deep Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(routes.layers)
app.include_router(routes.login_route)
app.include_router(routes.user_route)
app.include_router(routes.project_route)


# %% Bando de dados
from app.models.database import Base, engine, SessionLocal
from app.models import User

# Criando as tabelas do DB
os.makedirs("./DB", exist_ok=True)
Base.metadata.create_all(bind=engine)

# Adicionando o User ADM
db = SessionLocal()  # Cria uma única sessão
try:
    adm = db.query(User).filter((User.email == os.getenv("ADM_EMAIL"))).first()

    if not adm:
        adm = User(
            name="MASTER ADM",
            email=os.getenv("ADM_EMAIL"),
            admin=True,
            validEmail=True,
        )
        adm.set_password(os.getenv("ADM_PASSW"))
        db.add(adm)  # Adiciona explicitamente à sessão
        db.commit()  # Faz commit da sessão atual
finally:
    db.close()  # Garante que a sessão será fechada

    