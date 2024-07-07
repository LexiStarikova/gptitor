import Core
import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from fastapi import HTTPException
from Core import crud, schemas
from Core.models import Conversation, Task, Message, Feedback
from sqlalchemy.orm import Session

def test_send_query_success(client: TestClient, db_session: Session, conversation_data, task_data):
    query = schemas.Query(query_text="Test query", task_id=task_data.task_id)
    response = client.post(f"/conversations/{conversation_data.conversation_id}/messages", json=query.model_dump())
    if response.status_code != 201:
        print(response.status_code)
        print(response.json())
    assert response.status_code == 201
    data = response.json()
    assert "conversation_id" in data
    assert "query_id" in data
    assert "response_id" in data
    assert data["response_text"]  
    assert data["comment"]  
    assert data["metrics"] 

def test_send_query_empty_query(client: TestClient, db_session: Session, conversation_data, task_data):
    query = schemas.Query(query_text="", task_id=task_data.task_id)
    response = client.post(f"/conversations/{conversation_data.conversation_id}/messages", json=query.model_dump())
    assert response.status_code == 400
    assert response.json()["detail"] == "Question cannot be empty"

def test_send_query_invalid_conversation(client: TestClient, db_session: Session, task_data):
    query = schemas.Query(query_text="Test query", task_id=task_data.task_id)
    response = client.post("/conversations/999/messages", json=query.model_dump())
    assert response.status_code == 404
    assert "Conversation with ID 999 not found." in response.json()["detail"]

def test_send_query_invalid_task(client: TestClient, db_session: Session, conversation_data):
    query = schemas.Query(query_text="Test query", task_id=999)
    response = client.post(f"/conversations/{conversation_data.conversation_id}/messages", json=query.model_dump())
    assert response.status_code == 404
    assert "Task with ID 999 not found." in response.json()["detail"]

def test_send_query_internal_server_error(client: TestClient, db_session: Session, conversation_data, task_data, mocker):
    mocker.patch("Core.crud.get_chatbot_response", side_effect=Exception("Test error"))
    
    query = schemas.Query(query_text="Test query", task_id=task_data.task_id)
    response = client.post(f"/conversations/{conversation_data.conversation_id}/messages", json=query.model_dump())
    assert response.status_code == 500
    assert "Internal server error" in response.json()["detail"]
