from typing import Optional
from pydantic import BaseModel

class UserType(BaseModel):
    id: str
    name: str
    email: str

    admin: bool
    status: bool

    validEmail: bool
    universityId: Optional[str]
    universityValid: Optional[bool]

    lastResetPassword: Optional[str]
    resetPasswordCode: Optional[str]

    lastLogin: Optional[str]
    insertDate: str
    updateDate: Optional[str]
    updateBy: Optional[str]

