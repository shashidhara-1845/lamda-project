from pydantic import BaseModel
from typing import Optional

class model(BaseModel):
    # This is the model for the task that we will receive from the React frontend
    task: str
    description: Optional[str] = None  # This catches the description from React
    tag: int
    status: bool = False
    due_date: str | None = None