from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
db_url = "mysql+pymysql://root:ssdrjee@638@localhost:3306/task_db"
engine = create_engine(db_url)
Sessionlocal=sessionmaker()


