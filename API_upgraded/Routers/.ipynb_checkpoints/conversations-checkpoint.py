from fastapi import APIRouter, HTTPException, Depends
from typing import List
from Core import crud, schemas, models
from Authentication import auth

router = APIRouter()

@router.post("", response_model=schemas.Conversation, status_code=201)
def create_new_conversation(llm_id: schemas.LLM_ID, user_id: int = Depends(auth.get_current_user)):
    return crud.create_new_conversation(llm_id=llm_id.llm_id, user_id=user_id)

@router.delete("/{conversation_id}", response_model=str, status_code=200)
def delete_conversation(conversation_id: int, user_id: int = Depends(auth.get_current_user)):
    return crud.delete_conversation(conversation_id=conversation_id, user_id=user_id)

@router.get("", response_model=List[schemas.Conversation], status_code=200)
def get_all_conversations(user_id: int = Depends(auth.get_current_user)):
    return crud.get_all_conversations(user_id=user_id)