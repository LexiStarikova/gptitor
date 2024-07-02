from fastapi import APIRouter, HTTPException, Depends
from Core import crud, schemas
from typing import List
from Authentication import auth

router = APIRouter()

@router.get("/{user_id}/statistics", response_model=schemas.PersonalStatistics, status_code=200)
def calculate_personal_statistics(user_id: int = Depends(auth.get_current_user)):
    return crud.calculate_personal_statistics(user_id)
