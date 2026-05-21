from fastapi import FastAPI,Depends 
from tasks import *
from database import*
from sqlalchemy.orm import Session
app = FastAPI()
def get_db():
    db=Sessionlocal()
    try:
        yield db
    finally:
        db.close
@app.get("/")
def greet():
    return "Hello"
tasks=[]
@app.get("/task")
def show_tasks():
    pass
@app.put("/task")
def put_task(task,db:Session=Depends(get_db())):
    db.add(task)
    return "Added succesfully"

    



