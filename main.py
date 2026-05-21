from fastapi import FastAPI,Depends 
from tasks import *
from database import*
from model import *

Base.metadata.create_all(bind=engine)
app = FastAPI()
def get_db():
    db=Sessionlocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def greet():
    return "Hello"

@app.get("/task")
def show_tasks(db=Depends(get_db)):
    return db.query(tasks).all()

@app.post("/task")
def put_task(m: model,db=Depends(get_db)):
    db.add(tasks(**m.model_dump()))
    db.commit()
    return "Added succesfully"

# @app.put("/task/{id}")
# def change_status(id):




