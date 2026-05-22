from sqlalchemy import Column,Integer,String,Boolean
from sqlalchemy.ext.declarative import declarative_base
Base=declarative_base()
class tasks(Base):
    __tablename__ = "tasks"
    id=Column(Integer,primary_key=True,index=True,autoincrement=True)
    name=Column(String(255))
    status=Column(Boolean,default=False)
    tag=Column(Integer)
    

