from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel

class Paginate(BaseModel):
    page: int
    per_page: int
    
    # ordem da ornação
    order_in: Optional[List[Literal["asc", "desc"]]|Literal["asc", "desc"]] = "desc"

    # Coluna da ordenação
    order_by: Optional[List[str]|str] = None

    # Valor para comparação na ordenação de strings
    order: Optional[List[Any]|Any] = None

    # Coluna do filtro
    filter_by: Optional[Dict[str, Any]] = None

