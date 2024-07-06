from fastapi import APIRouter, Depends
from Core import crud, schemas, database
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/{task_id}", response_model=schemas.Task, status_code=200)
def get_task_by_id(task_id: int, 
                   db: Session = Depends(database.get_db)):
    return crud.get_task_by_id(db=db, task_id=task_id)
