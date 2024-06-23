import os
import gc
import time
import json
import traceback
from typing import List, Dict, Any, Union, Optional
from typing_extensions import Annotated
import uuid
from datetime import datetime

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
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, Field, Json, ValidationError
import pandas as pd

import nest_asyncio
import asyncio
from llm import LLM
import sqlite3

app = FastAPI()
llm = LLM()
db_file = "db_project.db"


# Allow all origins, methods, and headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Query(BaseModel):
    query_text: str = Field(default="", 
                            examples=["Example query"], 
                            max_length=2048)

#TODO: implement renaming
class Name(BaseModel):
    new_name: str = Field(default="Untitled", 
                            examples=["Example name"], 
                            max_length=2048)

class QueryResponsePair(BaseModel):
    user_id: int = Field(default=0, 
                         examples=[0])
    query_id: int = Field(default=0, 
                          examples=[0])
    query_text: str = Field(default="", 
                            examples=["Example query"], 
                            max_length=2048)
    llm_id: int = Field(default=0, 
                          examples=[0])
    response_id: int = Field(default=0, 
                             examples=[0])
    response_text: str = Field(default="", 
                               examples=["Example response"], 
                               max_length=2048)
    comment: str = Field(default="", 
                         examples=["Example comment"], 
                         max_length=2048)
    conversation_id: int = Field(default=0, 
                                 examples=[0])
    
class Conversation(BaseModel):
    conversation_id: int = Field(default=0, 
                                 examples=[0])
    user_id: int = Field(default=0, 
                         examples=[0])
    title: Optional[str] = Field(default="Untitled", 
                                 examples=["Example title"], 
                                 max_length=255)
    keywords: Optional[str] = Field(default=None, 
                                    examples=["Example keywords"], 
                                    max_length=255)
    task_id: Optional[int] = None


class Score(BaseModel):
    criterion_1: float = Field(default=0.0, 
                             examples=[0.5, 2.9])
    criterion_2: float = Field(default=0.0, 
                             examples=[0.5, 2.9])
    criterion_3: float = Field(default=0.0, 
                             examples=[0.5, 2.9])
    criterion_4: float = Field(default=0.0, 
                              examples=[0.5, 2.9])

class Criterion(BaseModel):
    score: float = Field(default=0.0,
                         examples=[0.0])

class Task(BaseModel):
    task_id: int = Field(default=0, 
                         examples=[0])
    task_name: str = Field(default="", 
                           examples=["Example name"], 
                           max_length=255)
    category: str = Field(default="", 
                           examples=["Example category"], 
                           max_length=255)
    description: str = Field(default="", 
                             examples=["Example description"], 
                             max_length=2048)

# TODO: calculate score over criteria
async def calculate_score(query: str, task: str) -> dict:
    score = {
        "criterion_1": await calculate_criterion_style(query, task),
        "criterion_2": await calculate_criterion_accuracy(query, task),
        "criterion_3": await calculate_criterion_number_of_vowels(query, task),
        "criterion_4": await calculate_criterion_weather(query, task)
    }
    return score

async def calculate_criterion_style(query: str, task: str) -> float:
    #task = "Write a poem about crying in the rain"
    
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {query}
    Rate this answer in terms of writing style, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": "([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_accuracy(query: str, task: str) -> float:    
    #task = "Write a poem about crying in the rain"
    
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {query}
    Rate this answer in terms of accuracy of the answer, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": "([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_number_of_vowels(query: str, task: str) -> float:
    #task = "Write a poem about crying in the rain"
    
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {query}
    Rate this answer in terms of number_of_vowels, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": "([0-4](\.[0-9]))"})
    return float(res)

async def calculate_criterion_weather(query: str, task: str) -> float:
    #task = "Write a poem about crying in the rain"
    
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {query}
    Rate this answer in terms of weather on the street, give a rating from 0 to 5. Put only one number:"""
    
    res = await llm.get_response({"prompt": prompt, "regex": "([0-4](\.[0-9]))"})
    return float(res)

# Simulated chatbot response function
async def get_chatbot_response(query: str, task: str) -> str:
    #task = "Write a poem about crying in the rain"
    
    # prompt = f"""You are chatbot for solving hard problems.
    # There is the task: {task}.
    # There is the user prompt for this problem: {query}
    # Your response is:"""

    prompt = query
    
    res = await llm.get_response({"prompt": prompt, 'temperature': 0.1, 'max_tokens': 300})
    return res

async def get_chatbot_comment(query: str, task: str) -> str:
    #task = "Write a poem about crying in the rain"
    
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the prompt that the user formulated to solve this problem: {query}
    Give a polite comment about this:"""
    
    res = await llm.get_response({"prompt": prompt, 'temperature': 0.1, 'max_tokens': 300})
    return res


#TODO: implement generating title when the first query in a chat is sent
def generate_title(conversation: Conversation):
    return f"Title example for conversation: {conversation.conversation_id}"

#TODO: implement extracting keywords when the first query in a chat is sent
def extract_keywords(conversation: Conversation):
    return f"Keywords example for conversation: {conversation.conversation_id}"

#oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Mock function for getting current user
#def get_current_user(token: str = Depends(oauth2_scheme)) -> uuid.UUID:
def get_current_user() -> int:
    # Fetch the user from the request's authentication context:
    # validate the token and extract the user information
    return 0

@app.post("/conversations", response_model=Conversation, status_code=201)
async def create_new_conversation(user_id: int = Depends(get_current_user)):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        sql_insert = '''INSERT INTO Conversation (user_id, title, keywords, created_at)
                         VALUES (?, ?, ?, ?)'''
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(sql_insert, (user_id, "Untitled", None, created_at))
        conn.commit() # Save changes
        conversation = Conversation(user_id=user_id, 
                                    conversation_id=cursor.lastrowid
                                    )
        return conversation
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

@app.delete("/conversations/{conversation_id}", response_model=str, status_code=200)
async def delete_conversation(conversation_id: int, user_id: int = Depends(get_current_user)):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
    
        cursor.execute("SELECT * FROM Conversation WHERE conversation_id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        
        if conversation:
            # If conversation exists, delete it
            cursor.execute("DELETE FROM Conversation WHERE conversation_id = ?", (conversation_id,))
            conn.commit()
            return f"Conversation with ID {conversation_id} deleted successfully."
        else:
            raise HTTPException(status_code=404, detail=f"Conversation with ID {conversation_id} not found.")
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        if conn:
            conn.close()
  
@app.put("/conversations/{conversation_id}/messages", response_model=QueryResponsePair, status_code=201)
# TODO: check whether user has a real access to the conversation
async def send_query(conversation_id: int, query: Query, user_id: int = Depends(get_current_user), llm_id=0, task_id=2):
    if not query.query_text.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Conversation WHERE conversation_id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        
        if not conversation:
            raise HTTPException(status_code=404, detail=f"Conversation with ID {conversation_id} not found.")

        cursor.execute("SELECT task_description FROM Task WHERE task_id = ?", (task_id,))
        task = cursor.fetchone()
        
        if not task:
            raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found.")
            
        sql_insert = '''INSERT INTO Request (conversation_id, user_id, content, created_at)
                         VALUES (?, ?, ?, ?)'''
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(sql_insert, (conversation_id, user_id, query.query_text, created_at))
        query_id=cursor.lastrowid
        conn.commit() # Save changes

        content = str(await get_chatbot_response(query=query.query_text, task=task))
        comment = str(await get_chatbot_comment(query=query.query_text, task=task))

        sql_insert = '''INSERT INTO Response (request_id, conversation_id, API_id, content, comment, created_at)
                VALUES (?, ?, ?, ?, ?, ?)'''
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(sql_insert, (query_id, conversation_id, llm_id, content, comment, created_at))
        response_id=cursor.lastrowid
        conn.commit() # Save changes
        
        score= await calculate_score(query=query.query_text, task=task)

        sql_insert = '''INSERT INTO Score (request_id, criterion_1, criterion_2, criterion_3, criterion_4)
                VALUES (?, ?, ?, ?, ?)'''
        cursor.execute(sql_insert, (query_id, 
                                    score["criterion_1"], 
                                    score["criterion_2"], 
                                    score["criterion_3"], 
                                    score["criterion_4"]))
        conn.commit() # Save changes
        
        response = QueryResponsePair(user_id=user_id,
                                    query_id=query_id,
                                    query_text=query.query_text,
                                    llm_id=llm_id,
                                    response_id=response_id,
                                    response_text=content,
                                    # query_score=score,
                                    # query_metrics=metrics,
                                    comment=comment,
                                    conversation_id=conversation_id)
        return response
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

@app.get("/conversations/", response_model=List[Dict[str, Any]], status_code=200)
async def get_all_conversations():
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    cursor.execute("SELECT conversation_id, created_at FROM Conversation")
    conversations=cursor.fetchall()
    conn.close()
    data = [{"conversation_id": conv[0], "created_at": conv[1]} for conv in conversations]
    return data

@app.get("/tasks/{task_id}", response_model=Task, status_code=200)
async def get_task_by_id(task_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Task WHERE task_id = ?", (task_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found.")
        return Task(task_id=row[0], 
                    task_name=row[1], 
                    category=row[2], 
                    description=row[3])
    
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

@app.get("/conversations/{conversation_id}", response_model=List[QueryResponsePair], status_code=200)
async def get_all_messages_by_conversation_id(conversation_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM Conversation WHERE conversation_id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        
        if not conversation:
            raise HTTPException(status_code=404, detail=f"Conversation with ID {conversation_id} not found.")
        sql_join_query = '''
                            SELECT 
                                req.user_id AS user_id,
                                req.request_id AS request_id,
                                req.content AS request_content,
                                res.response_id AS response_id,
                                res.content AS response_content,
                                res.API_id AS API_id,
                                res.comment AS comment
                            FROM 
                                Request req
                            LEFT JOIN 
                                Response res
                            ON 
                                req.request_id = res.request_id
                            WHERE 
                                req.conversation_id = ?
                        '''
        cursor.execute(sql_join_query, (conversation_id,))
        rows = cursor.fetchall()
        messages: List[QueryResponsePair] = [
            QueryResponsePair(
                user_id=row[0],
                query_id=row[1],
                query_text=row[2],
                response_id=row[3],
                response_text=row[4],
                llm_id=row[5],
                comment=row[6],
                conversation_id=conversation_id
            ) for row in rows
        ]
        return messages
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

@app.get("/conversations/{conversation_id}/messages/{query_id}", response_model=QueryResponsePair, status_code=200)
async def get_query_response_pair_by_query_id(conversation_id: int, query_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM Conversation WHERE conversation_id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        
        if not conversation:
            raise HTTPException(status_code=404, detail=f"Conversation with ID {conversation_id} not found.")
        cursor.execute("SELECT * FROM Request WHERE request_id = ?", (query_id,))
        request = cursor.fetchone()
        
        if not request:
            raise HTTPException(status_code=404, detail=f"Request with ID {query_id} not found.")
        sql_join_query = '''
                            SELECT 
                                req.user_id AS user_id,
                                req.request_id AS request_id,
                                req.content AS request_content,
                                res.response_id AS response_id,
                                res.content AS response_content,
                                res.API_id AS API_id,
                                res.comment AS comment
                            FROM 
                                Request req
                            LEFT JOIN 
                                Response res
                            ON 
                                req.request_id = res.request_id
                            WHERE 
                                req.conversation_id = ?
                            AND req.request_id = ?
                        '''
        cursor.execute(sql_join_query, (conversation_id, query_id))
        row = cursor.fetchone()
    
        query_response_pair = QueryResponsePair(
                                                user_id=row[0],
                                                query_id=row[1],
                                                query_text=row[2],
                                                response_id=row[3],
                                                response_text=row[4],
                                                llm_id=row[5],
                                                comment=row[6],
                                                conversation_id=conversation_id
                                                )
        return query_response_pair
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

def get_criterion(query_id: int, criterion_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM Request WHERE request_id = ?", (query_id,))
        request = cursor.fetchone()
        
        if not request:
            raise HTTPException(status_code=404, detail=f"Request with ID {query_id} not found.")

        cursor.execute(f"SELECT criterion_{criterion_id} FROM Score WHERE request_id = ?", (query_id,))
        criterion = cursor.fetchone()
        
        if not criterion:
            raise HTTPException(status_code=404, detail=f"Criterion {criterion_id} score with ID {query_id} not found.")
        return Criterion(score=criterion[0])
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()

@app.get("/feedback/{query_id}/criterion_1", response_model=Criterion, status_code=200)
async def get_criterion_1_by_query_id(query_id: int):
    return get_criterion(query_id, 1)
    
@app.get("/feedback/{query_id}/criterion_2", response_model=Criterion, status_code=200)
async def get_criterion_2_by_query_id(query_id: int):
    return get_criterion(query_id, 2)

@app.get("/feedback/{query_id}/criterion_3", response_model=Criterion, status_code=200)
async def get_criterion_3_by_query_id(query_id: int):
    return get_criterion(query_id, 3)

@app.get("/feedback/{query_id}/criterion_4", response_model=Criterion, status_code=200)
async def get_criterion_4_by_query_id(query_id: int):
    return get_criterion(query_id, 4)
    
@app.get("/feedback/{query_id}/score", response_model=Score, status_code=200)
async def get_total_score_by_query_id(query_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM Request WHERE request_id = ?", (query_id,))
        request = cursor.fetchone()
        
        if not request:
            raise HTTPException(status_code=404, detail=f"Request with ID {query_id} not found.")

        cursor.execute("SELECT criterion_1, criterion_2, criterion_3, criterion_4 FROM Score WHERE request_id = ?", (query_id,))
        score = cursor.fetchone()
        
        if not score:
            raise HTTPException(status_code=404, detail=f"Score with ID {query_id} not found.")
        return Score(criterion_1=score[0], 
                       criterion_2=score[1], 
                       criterion_3=score[2], 
                       criterion_4=score[3])
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()
