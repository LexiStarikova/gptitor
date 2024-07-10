from fastapi import APIRouter, Depends
from Core import crud, schemas, database
from typing import List
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("", response_model=List[schemas.LLM])
def get_llm_list(db: Session = Depends(database.get_db)):
    return crud.get_llm_list(db=db)
