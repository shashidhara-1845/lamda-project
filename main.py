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

@app.put("/task/{name}")
def change_status(name,db=Depends(get_db)):
    task=db.query(tasks).filter(tasks.name==name).first()
    if task:
        task.status=not task.status
        db.commit()
        return "Status changed"
    else:
        return "Task not found"

@app.delete("/task/{name}")
def delete_task(name,db=Depends(get_db)):
    task=db.query(tasks).filter(tasks.name==name).first()
    if task:
        db.delete(task)
        db.commit()
        return "Task deleted"
    else:
        return "Task not found"







