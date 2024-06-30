from fastapi import APIRouter, HTTPException, Depends
from Core import crud, schemas
from typing import List
from Authentication import auth

router = APIRouter()

@router.get("/{conversation_id}/messages", response_model=List[schemas.Message], status_code=200)
def get_all_messages_by_conversation_id(conversation_id: int):
    return crud.get_all_messages_by_conversation_id(conversation_id)

@router.post("/{conversation_id}/messages", response_model=schemas.EntireResponse, status_code=201)
async def send_query(conversation_id: int, query: schemas.Query, user_id: int = Depends(auth.get_current_user)):
    return await crud.send_query(conversation_id=conversation_id, query=query, user_id=user_id)
    
