# TODO: remove unused imports (flake8)
from fastapi import APIRouter, Depends
# from fastapi import HTTPException
from typing import List
from Core import crud, schemas, database
# from Core import models
from Authentication import auth
from sqlalchemy.orm import Session

router = APIRouter()


@router.post("", response_model=schemas.Conversation, status_code=201)
def create_new_conversation(llm_id: schemas.LLM_ID,
                            user_id: int = auth.get_current_user(),
                            db: Session = Depends(database.get_db)):
    return crud.create_new_conversation(db=db,
                                        llm_id=llm_id.llm_id,
                                        user_id=user_id)


@router.delete("/{conversation_id}", response_model=str, status_code=200)
def delete_conversation(conversation_id: int,
                        user_id: int = auth.get_current_user(),
                        db: Session = Depends(database.get_db)):
    return crud.delete_conversation(db=db,
                                    conversation_id=conversation_id,
                                    user_id=user_id)


@router.get("", response_model=List[schemas.Conversation], status_code=200)
def get_all_conversations(user_id: int = auth.get_current_user(),
                          db: Session = Depends(database.get_db)):
    return crud.get_all_conversations(db=db,
                                      user_id=user_id)
