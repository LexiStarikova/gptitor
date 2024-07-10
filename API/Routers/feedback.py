from fastapi import APIRouter, Depends
from Core import crud, schemas, database
# TODO! MAKE SURE THAT Utilities.feedback NOT USED !!! (flake8)
# from Utilities.feedback import *
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/{query_id}", response_model=schemas.Feedback, status_code=200)
def get_feedback_by_query_id(query_id: int,
                             db: Session = Depends(database.get_db)):
    return crud.get_feedback_by_query_id(db=db, query_id=query_id)
