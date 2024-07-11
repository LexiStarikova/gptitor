from fastapi import APIRouter, Depends
from Core import crud, schemas, database
from sqlalchemy.orm import Session
from typing import List

router = APIRouter()


@router.get("/{task_id}", response_model=schemas.Task, status_code=200)
def get_task_by_id(task_id: int,
                   db: Session = Depends(database.get_db)):
    return crud.get_task_by_id(db=db, task_id=task_id)

@router.get("", response_model=List[schemas.Task], status_code=200)
def get_all_tasks(db: Session = Depends(database.get_db)):
    return crud.get_all_tasks(db=db)
