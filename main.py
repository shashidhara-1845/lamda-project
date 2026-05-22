from fastapi import FastAPI, Depends 
from tasks import *
from database import *
from model import *
from sqlalchemy.orm import Session 

Base.metadata.create_all(bind=engine)
app = FastAPI()

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def greet():
    return "Hello"

@app.get("/task")
def show_tasks(db: Session = Depends(get_db)):
    return db.query(tasks).all()

@app.post("/task")
def put_task(m: model, db: Session = Depends(get_db)):
    new_task = tasks(**m.model_dump())
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return {"message": "Task added", "id": new_task.id}

@app.put("/task/{id}")
def change_status(id: int, db: Session = Depends(get_db)):
    task = db.query(tasks).filter(tasks.id == id).first()
    if task:
        task.status = not task.status
        db.commit()
        return {"message": "Status changed"}
    else:
        return {"message": "Task not found"}

@app.delete("/task/{id}")
def delete_task(id: int, db: Session = Depends(get_db)):
    task = db.query(tasks).filter(tasks.id == id).first()
    if task:
        db.delete(task)
        db.commit()
        return {"message": "Task deleted"}
    else:
        return {"message": "Task not found"}