from fastapi import APIRouter, Depends
from Core import crud, schemas, database
from typing import List
from Authentication import auth
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/{conversation_id}/messages",
            response_model=List[schemas.Message],
            status_code=200)
def get_all_messages_by_conversation_id(
            conversation_id: int,
            db: Session = Depends(database.get_db)):
    return crud.get_all_messages_by_conversation_id(
            db=db,
            conversation_id=conversation_id)


@router.post("/{conversation_id}/messages",
             response_model=schemas.EntireResponse,
             status_code=201)
async def send_query(conversation_id: int,
                     query: schemas.Query,
                     user_id: int = auth.get_current_user(),
                     db: Session = Depends(database.get_db)):
    return await crud.send_query(db=db,
                                 conversation_id=conversation_id,
                                 query=query,
                                 user_id=user_id)
