from app.fastapi_types import (
    MoE,
    LSTM,
    GELU,
    SiLU,
    ReLU,
    Tanh,
    Linear,
    Conv1d,
    Conv2d,
    Softmax,
    Dropout,
    Sigmoid,
    LeakyReLU,
    BatchNorm2d,
    MultiheadAttention,
    LayerType,
)

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Path,
    Query,
    File,
    UploadFile,
    Request
)
from sqlalchemy import and_
from sqlalchemy.orm import Session

from app.models.database import get_db, paginate_query
from app.fastapi_types import *

layers = APIRouter(prefix="/layers", tags=["Layers PyTorch"])

# Erros
not_found = HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Não encontrado",
)


@layers.get("/list", response_model=list[LayerType])
async def get_layers(db: Session = Depends(get_db)):
    return [
        MoE(experts=[], out_features=1),
        LSTM(input_size=1, hidden_size=1),
        GELU(),
        SiLU(),
        ReLU(),
        Tanh(),
        Linear(in_features=1, out_features=1),
        Conv1d(in_channels=1, out_channels=1, kernel_size=1),
        Conv2d(in_channels=1, out_channels=1, kernel_size=1),
        Softmax(),
        Dropout(p=1),
        Sigmoid(),
        LeakyReLU(),
        BatchNorm2d(num_features=1),
        MultiheadAttention(embed_dim=1, num_heads=1),
    ]

