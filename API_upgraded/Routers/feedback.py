from fastapi import APIRouter, Depends
from Core import crud, schemas
from Utilities.feedback import *

router = APIRouter()

@router.get("/{query_id}", response_model=schemas.Feedback, status_code=200)
def get_feedback_by_query_id(query_id: int):
    return crud.get_feedback_by_query_id(query_id=query_id)
    
@router.get("/{query_id}/metrics", response_model=schemas.Metrics, status_code=200)
def get_metrics_by_query_id(query_id: int):
    return crud.get_metrics_by_query_id(query_id)