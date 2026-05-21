from pydantic import BaseModel
class model(BaseModel):
    id: int
    task: str
    status: bool
    tag: int