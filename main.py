from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from tasks import *
from database import *
from model import *
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def greet():
    return {"message": "Task Management API"}


@app.get("/task")
def show_tasks(tag: int = None, db: Session = Depends(get_db)):
    q = db.query(tasks)

    if tag is not None:
        q = q.filter(tasks.tag == tag)

    return q.all()


@app.post("/task")
def put_task(m: model, db: Session = Depends(get_db)):
    new_task = tasks(**m.model_dump())

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return {"message": "Task added", "id": new_task.id}


@app.put("/task/{id}")
def update_task(id: int, m: model, db: Session = Depends(get_db)):
    task = db.query(tasks).filter(tasks.id == id).first()

    if not task:
        return {"message": "Task not found"}

    task.task = m.task
    task.description = m.description
    task.tag = m.tag
    task.status = m.status

    
    task.due_date = m.due_date

    db.commit()

    return {"message": "Task updated"}


@app.delete("/task/{id}")
def delete_task(id: int, db: Session = Depends(get_db)):
    task = db.query(tasks).filter(tasks.id == id).first()

    if not task:
        return {"message": "Task not found"}

    db.delete(task)
    db.commit()

    return {"message": "Task deleted"}