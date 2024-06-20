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

import nest_asyncio
import asyncio
from llm import LLM
import sqlite3

app = FastAPI()
llm = LLM()
db_file = "db_project.db"
logging.basicConfig(level=logging.INFO)

class Query(BaseModel):
    query_text: str = Field(default="", 
                            examples=["Example query"], 
                            max_length=2048)
class Criterion(BaseModel):
    score: float = Field(default=0.0,
                         examples=[0.0])

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
    # query_score: dict = Field(default={"criterion_1":0.0, 
    #                                    "criterion_2":0.0,
    #                                    "criterion_3":0.0,
    #                                    "criterion_4":0.0}, 
    #                           examples=[{"criterion_1":0.5, 
    #                                    "criterion_2":2.7,
    #                                    "criterion_3":9.5,
    #                                    "criterion_4":7.5}])
    # query_metrics: dict = Field(default={"metric_1":0.0, 
    #                                    "metric_2":0.0,
    #                                    "metric_3":0.0,
    #                                    "metric_4":0.0}, 
    #                           examples=[{"metric_1":0.5, 
    #                                    "metric_2":2.7,
    #                                    "metric_3":9.5,
    #                                    "metric_4":7.5}])
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


# class Score(BaseModel):
#     criterion_1: float = Field(default=0.0, 
#                              examples=[0.5, 2.9])
#     criterion_2: float = Field(default=0.0, 
#                              examples=[0.5, 2.9])
#     criterion_3: float = Field(default=0.0, 
#                              examples=[0.5, 2.9])
#     criterion_4: float = Field(default=0.0, 
#                               examples=[0.5, 2.9])

class Metrics(BaseModel):
    metric_1: float = Field(default=0.0, 
                             examples=[0.5, 2.9])
    metric_2: float = Field(default=0.0, 
                             examples=[0.5, 2.9])
    metric_3: float = Field(default=0.0, 
                             examples=[0.5, 2.9])
    metric_4: float = Field(default=0.0, 
                              examples=[0.5, 2.9])
    
class Task(BaseModel):
    task_id: int
    task_name: str
    topic: str
    description: str

# TODO: get score over criteria
def get_score(query: str) -> dict:
    criterion_1 = 0.5
    criterion_2 = 0.5
    criterion_3 = 0.5
    criterion_4 = 0.5
    score = {
        "criterion_1":criterion_1,
        "criterion_2":criterion_2,
        "criterion_3":criterion_3,
        "criterion_4":criterion_4
    }
    return score

# TODO: implement calculations
def calculate_metrics(query: str) -> dict:
    metric_1 = 0.5
    metric_2 = 0.5
    metric_3 = 0.5
    metric_4 = 0.5
    metrics = {
        "metric_1":metric_1,
        "metric_2":metric_2,
        "metric_3":metric_3,
        "metric_4":metric_4
    }
    return metrics

# Simulated chatbot response function
async def get_chatbot_response(question: str) -> str:
    task = "Write a poem about crying in the rain"
    
    prompt = f"""You are chatbot for solving hard problems.
    There is the task: {task}.
    There is the user prompt for this problem: {question}
    Your response is:"""
    
    res = await llm.get_response({"prompt": prompt})
    return res

async def get_chatbot_comment(question: str) -> str:
    task = "Write a poem about crying in the rain"
    
    prompt = f"""You are chatbot for reviewing solutions for hard problems.
    There is the task: {task}.
    There is the solution that user obtained for this problem: {question}
    Give a comments about this:"""
    
    res = await llm.get_response({"prompt": prompt})
    return res

def generate_title(conversation: Conversation):
    return f"Title example for conversation: {conversation.conversation_id}"

def extract_keywords(conversation: Conversation):
    return f"Keywords example for conversation: {conversation.conversation_id}"

#oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
# Mock function for getting current user
#def get_current_user(token: str = Depends(oauth2_scheme)) -> uuid.UUID:
def get_current_user() -> int:
    # Fetch the user from the request's authentication context:
    # validate the token and extract the user information
    return 0

#TODO: Complete creating
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

@app.delete("/conversations", response_model=str, status_code=200)
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
  
@app.put("/conversations/{conversation_id}/messages", response_model=QueryResponsePair, status_code=201) # 201 Created: Resource created.
# TODO: check whether user has a real access to the conversation
async def send_query(conversation_id: int, query: Query, user_id: int = Depends(get_current_user), llm_id=0):
    if not query.query_text.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Conversation WHERE conversation_id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        
        if not conversation:
            raise HTTPException(status_code=404, detail=f"Conversation with ID {conversation_id} not found.")
        sql_insert = '''INSERT INTO Request (conversation_id, user_id, content, created_at)
                         VALUES (?, ?, ?, ?)'''
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(sql_insert, (conversation_id, user_id, query.query_text, created_at))
        query_id=cursor.lastrowid
        conn.commit() # Save changes

        content = str(await get_chatbot_response(query.query_text))
        comment = str(await get_chatbot_comment(query.query_text))

        sql_insert = '''INSERT INTO Response (request_id, conversation_id, API_id, content, comment, created_at)
                VALUES (?, ?, ?, ?, ?, ?)'''
        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        cursor.execute(sql_insert, (query_id, conversation_id, llm_id, content, comment, created_at))
        response_id=cursor.lastrowid
        conn.commit() # Save changes
        
        score=get_score(query.query_text)
        metrics=calculate_metrics(query.query_text)

        sql_insert = '''INSERT INTO Criteria (request_id, criterion_1, criterion_2, criterion_3, criterion_4)
                VALUES (?, ?, ?, ?, ?)'''
        cursor.execute(sql_insert, (response_id, 
                                    score["criterion_1"], 
                                    score["criterion_2"], 
                                    score["criterion_3"], 
                                    score["criterion_4"]))
        conn.commit() # Save changes

        sql_insert = '''INSERT INTO Metrics (request_id, metric_1, metric_2, metric_3, metric_4)
                VALUES (?, ?, ?, ?, ?)'''
        cursor.execute(sql_insert, (query_id, 
                                    metrics["metric_1"], 
                                    metrics["metric_2"], 
                                    metrics["metric_3"], 
                                    metrics["metric_4"]))
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
        conn.close()
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
        conn.close()
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

        cursor.execute(f"SELECT criterion_{criterion_id} FROM Criteria WHERE request_id = ?", (query_id,))
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
    
@app.get("/feedback/{query_id}/calculate_metrics", response_model=Metrics, status_code=200)
async def get_all_metrics_by_query_id(query_id: int):
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM Request WHERE request_id = ?", (query_id,))
        request = cursor.fetchone()
        
        if not request:
            raise HTTPException(status_code=404, detail=f"Request with ID {query_id} not found.")

        cursor.execute("SELECT metric_1, metric_2, metric_3, metric_4 FROM Metrics WHERE request_id = ?", (query_id,))
        metrics = cursor.fetchone()
        
        if not metrics:
            raise HTTPException(status_code=404, detail=f"Metrics with ID {query_id} not found.")
        return Metrics(metric_1=metrics[0], 
                       metric_2=metrics[1], 
                       metric_3=metrics[2], 
                       metric_4=metrics[3])
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")
    finally:
        if conn:
            conn.close()