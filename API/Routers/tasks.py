from fastapi import APIRouter
from Core import crud, schemas

router = APIRouter()

@router.get("/{task_id}", response_model=schemas.Task, status_code=200)
def get_task_by_id(task_id: int):
    return crud.get_task_by_id(task_id)
