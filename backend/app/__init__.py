from app.start_infiltrometro import *

exit(0)

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

# %% Bando de dados
from app.models.database import Base, engine

# Criando as tabelas do DB
os.makedirs("./DB", exist_ok=True)
Base.metadata.create_all(bind=engine)
    