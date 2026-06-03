from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

db_url = "mysql+pymysql://root:12345678@localhost:3306/task_db"
engine = create_engine(db_url)
Sessionlocal = sessionmaker(autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass