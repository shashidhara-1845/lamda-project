from sqlalchemy import Column, Integer, String, Boolean, Text
from database import Base  

class tasks(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    task = Column(String(255))
    description = Column(Text)
    status = Column(Boolean, default=False)
    tag = Column(Integer)
    due_date = Column(String(50))  