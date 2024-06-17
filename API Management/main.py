import os
import gc
import time
import json
import logging
import traceback
from typing import List, Dict, Any, Union, Optional
from typing_extensions import Annotated
import uuid
from datetime import datetime
import logging

from fastapi import (
    Body,
    Depends,
    FastAPI,
    HTTPException,
    Request,
    Response,
    status,
    File,
    UploadFile,
)
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.exception_handlers import request_validation_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.security import OAuth2PasswordBearer

from pydantic import BaseModel, Field, Json, ValidationError
import pandas as pd

app = FastAPI()
logging.basicConfig(level=logging.INFO)

class Query(BaseModel):
    query_text: str = Field(default="", 
                            examples=["Example query"], 
                            max_length=2048)

class QueryResponsePair(BaseModel):
    user_id: uuid.UUID = Field(default=uuid.UUID("00000000-0000-0000-0000-000000000000"), 
                               examples=["00000000-0000-0000-0000-000000000000"])
    query_id: uuid.UUID = Field(default=uuid.UUID("00000000-0000-0000-0000-000000000000"), 
                                examples=["00000000-0000-0000-0000-000000000000"]),
    query_text: str = Field(default="", 
                            examples=["Example query"], 
                            max_length=2048)
    response_id: uuid.UUID = Field(default=uuid.UUID("00000000-0000-0000-0000-000000000000"), 
                                   examples=["00000000-0000-0000-0000-000000000000"])
    response_text: str = Field(default="", 
                               examples=["Example response"], 
                               max_length=2048)
    query_score: List[float] = Field(default=[], 
                               examples=[[0.0, 2.5, 5.0, 10.0]])
    comment: str = Field(default="", 
                         examples=["Example comment"], 
                         max_length=2048)
    conversation_id: uuid.UUID = Field(default=uuid.UUID("00000000-0000-0000-0000-000000000000"), 
                                       examples=["00000000-0000-0000-0000-000000000000"])
    

class Conversation(BaseModel):
    conversation_id: uuid.UUID
    user_id: uuid.UUID
    messages: List[QueryResponsePair] = []
    title: Optional[str] = None
    keywords: Optional[List[str]] = None
    task_id: Optional[uuid.UUID] = None

class Task(BaseModel):
    task_id: uuid.UUID
    task_name: str
    topic: str
    description: str
    
# Temporary DB simulator
fake_user_database = {
    uuid.UUID("11111111-1111-1111-1111-111111111111"): {
        "user_name": "Example username"
    }
}
fake_conversation_database = {
    uuid.UUID("11111111-1111-1111-1111-111111111111"): {
        "conversation_id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "user_id": uuid.UUID("00000000-0000-0000-0000-000000000000"),
        "messages": [],
        "title": "Example title",
        "keywords": ["Example", "keywords"],
        "task_id": uuid.UUID("00000000-0000-0000-0000-000000000000")
    }
}
fake_messages_database = {
    uuid.UUID("11111111-1111-1111-1111-111111111111"): {
        "user_id": uuid.UUID("00000000-0000-0000-0000-000000000000"),
        "query_id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "query_text": "Example query",
        "response_id": uuid.UUID("00000000-0000-0000-0000-000000000000"),
        "response_text": "Example response",
        "query_score": [0.0, 1.0, 2.4, 10.0],
        "comment": "Example comment",
        "conversation_id": uuid.UUID("11111111-1111-1111-1111-111111111111")
    }
}
fake_metrics_database = {
    uuid.UUID("11111111-1111-1111-1111-111111111111"): {
        "response_id": uuid.UUID("00000000-0000-0000-0000-000000000000"),
        "criterion_1": 0.0,
        "criterion_2": 0.0,
        "criterion_3": 0.0,
        "criterion_4": 0.0
    }
}
fake_tasks_database = {
     uuid.UUID("11111111-1111-1111-1111-111111111111"): {
         "task_id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
         "task_name": "Name example",
         "topic":"Topic example",
         "description":"Description example"
     }
}

# To be implemented
def query_assessment(query: str):
    return [1.3, 1.4, 1.5, 1.7]

# Simulated chatbot response function
def get_chatbot_response(question: str) -> str:
    # For the sake of example, let's return a fixed response
    return f"Chatbot response to: {question}"

def get_chatbot_comment(question: str) -> str:
    # For the sake of example, let's return a fixed response
    return f"Chatbot comment to: {question}"

def generate_title(conversation: Conversation):
    return f"Title example for conversation: {conversation.conversation_id}"

def extract_keywords(conversation: Conversation):
    return f"Keywords example for conversation: {conversation.conversation_id}"

#oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Mock function for getting current user
#def get_current_user(token: str = Depends(oauth2_scheme)) -> uuid.UUID:
def get_current_user() -> uuid.UUID:
    # Fetch the user from the request's authentication context:
    # validate the token and extract the user information
    return uuid.uuid4()

#TODO: Complete creating
@app.post("/conversations", response_model=Conversation, status_code=201)
async def create_new_conversation(task_id: uuid.UUID, user_id: uuid.UUID = Depends(get_current_user)):
    conversation_id = uuid.uuid4()
    conversation = Conversation(user_id=user_id, 
                                conversation_id=conversation_id, 
                                title="Untitled", 
                                keywords=[], 
                                task_id=task_id)
    fake_conversation_database[conversation_id] = conversation.dict()
    return conversation

@app.delete("/conversations", response_model=Conversation, status_code=200)
async def delete_conversation(conversation_id: uuid.UUID, user_id: uuid.UUID = Depends(get_current_user)):
    if conversation_id not in fake_conversation_database:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conversation = Conversation(**fake_conversation_database.pop(conversation_id))
    return conversation
  
@app.put("/conversations/{conversation_id}/messages", response_model=QueryResponsePair, status_code=201) # 201 Created: Resource created.
# TODO: check whether user has a real access to the conversation
async def send_query(conversation_id: uuid.UUID, query: Query, user_id: uuid.UUID = Depends(get_current_user)):
    if not query.query_text.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    if conversation_id not in fake_conversation_database:
        raise HTTPException(status_code=404, detail="Conversation not found")
    try:
        query_id = uuid.uuid4()
        response_id = uuid.uuid4()
        answer = get_chatbot_response(query.query_text)
        comment = get_chatbot_comment(query.query_text)
        response = QueryResponsePair(user_id=user_id,
                                    query_id=query_id,
                                    query_text=query.query_text,
                                    response_id=response_id,
                                    response_text=answer,
                                    query_score=query_assessment(query.query_text),
                                    comment=comment,
                                    conversation_id=conversation_id)
        fake_messages_database[query_id] = response.dict()
        fake_conversation_database[conversation_id]["messages"].append(response)
    except Exception as e:
        logging.error(f"Internal server error: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    return response

@app.get("/conversations/{conversation_id}", response_model=Conversation, status_code=200)
async def get_all_messages_by_conversation_id(conversation_id: uuid.UUID):
    if conversation_id not in fake_conversation_database:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conversation = Conversation(**fake_conversation_database[conversation_id])
    return conversation

@app.get("/conversations/{conversation_id}/messages/{query_id}", response_model=QueryResponsePair, status_code=200)
async def get_query_response_pair_by_query_id(conversation_id: uuid.UUID, query_id: uuid.UUID):
    if conversation_id not in fake_conversation_database:
        raise HTTPException(status_code=404, detail="Conversation not found")
    if query_id not in fake_messages_database:
        raise HTTPException(status_code=404, detail="Message not found")
    pair = QueryResponsePair(**fake_messages_database[query_id])
    return pair



