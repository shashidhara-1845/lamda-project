from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()

db_url = os.getenv("DATABASE_URL")

engine = create_engine(db_url)
Sessionlocal = sessionmaker(autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass