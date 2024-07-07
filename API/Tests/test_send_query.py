import Core
import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from fastapi import HTTPException
from Core import crud, schemas
from Core.models import Conversation, Task, Message, Feedback
from sqlalchemy.orm import Session

@pytest.fixture
def new_conversation(db_session: Session):
    conversation = Conversation(title="Test Conversation", user_id=1, llm_id=1, created_at=datetime.now())
    db_session.add(conversation)
    db_session.commit()
    return conversation

@pytest.fixture
def new_task(db_session: Session):
    task = Task(task_name="Test Task", task_category="General", task_description="Testing task")
    db_session.add(task)
    db_session.commit()
    return task

def test_send_query_success(client: TestClient, db_session: Session, new_conversation, new_task):
    query = schemas.Query(query_text="Test query", task_id=new_task.task_id)
    response = client.post(f"/conversations/{new_conversation.conversation_id}/messages", json=query.model_dump())
    assert response.status_code == 201
    data = response.json()
    assert "conversation_id" in data
    assert "query_id" in data
    assert "response_id" in data
    assert data["response_text"]  # Ensure response_text is not empty
    assert data["comment"]  # Ensure comment is not empty
    assert data["metrics"]  # Ensure metrics are returned

def test_send_query_empty_query(client: TestClient, db_session: Session, new_conversation, new_task):
    query = schemas.Query(query_text="", task_id=new_task.task_id)
    response = client.post(f"/conversations/{new_conversation.conversation_id}/messages", json=query.model_dump())
    assert response.status_code == 400
    assert response.json()["detail"] == "Question cannot be empty"

def test_send_query_invalid_conversation(client: TestClient, db_session: Session, new_task):
    query = schemas.Query(query_text="Test query", task_id=new_task.task_id)
    response = client.post("/conversations/999/messages", json=query.model_dump())
    assert response.status_code == 404
    assert "Conversation with ID 999 not found." in response.json()["detail"]

def test_send_query_invalid_task(client: TestClient, db_session: Session, new_conversation):
    query = schemas.Query(query_text="Test query", task_id=999)
    response = client.post(f"/conversations/{new_conversation.conversation_id}/messages", json=query.model_dump())
    assert response.status_code == 404
    assert "Task with ID 999 not found." in response.json()["detail"]

def test_send_query_internal_server_error(client: TestClient, db_session: Session, new_conversation, new_task, mocker):
    mocker.patch("Core.crud.get_chatbot_response", side_effect=Exception("Test error"))
    
    query = schemas.Query(query_text="Test query", task_id=new_task.task_id)
    response = client.post(f"/conversations/{new_conversation.conversation_id}/messages", json=query.model_dump())
    assert response.status_code == 500
    assert "Internal server error" in response.json()["detail"]
