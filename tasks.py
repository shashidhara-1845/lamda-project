from sqlalchemy import Column,Integer,String,Boolean
from sqlalchemy.ext.declarative import declarative_base
Base=declarative_base()
class tasks(Base):
    __tablename__ = "tasks"
    id=Column(Integer,primary_key=True,index=True)
    task=Column(String)
    status=Column(Boolean)
    tag=Column(Integer)
    

