# TODO: remove unused imports (flake8)
from fastapi import APIRouter, Depends
# from fastapi import HTTPException
from Core import crud, schemas, database
# from typing import List
from Authentication import auth
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/statistics",
            response_model=schemas.PersonalStatistics,
            status_code=200)
def calculate_personal_statistics(user_id: int = auth.get_current_user(),
                                  db: Session = Depends(database.get_db)):
    return crud.calculate_personal_statistics(db=db, user_id=user_id)
