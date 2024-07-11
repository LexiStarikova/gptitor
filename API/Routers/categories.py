from fastapi import APIRouter, Depends
from Core import crud, schemas, database
from sqlalchemy.orm import Session
from typing import List

router = APIRouter()

@router.get("", response_model=List[schemas.TaskCategory], status_code=200)
def get_task_categories(db: Session = Depends(database.get_db)):
    return crud.get_task_categories(db=db)

@router.get("/{task_category}", response_model=List[schemas.Task], status_code=200)
def get_tasks_by_task_category(category_name: str, db: Session = Depends(database.get_db)):
    return crud.get_tasks_by_task_category(category_name=category_name, db=db)
