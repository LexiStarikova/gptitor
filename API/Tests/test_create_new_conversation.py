import pytest
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from Core import models, schemas, crud
from Core.main import app

@pytest.fixture
def new_conversation_data():
    return {
        "llm_id": 1
    }

@pytest.fixture
def user_data(db_session: Session):
    user = models.User(token="token", name="username")
    db_session.add(user)
    db_session.commit()
    return user

def test_create_conversation(client: TestClient, new_conversation_data, user_data):
    response = client.post("/conversations", json=new_conversation_data)
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == user_data.user_id
    assert data["llm_id"] == new_conversation_data["llm_id"]
    assert data["title"] == "Untitled"
    assert "created_at" in data

def test_create_conversation_missing_llm_id(client: TestClient, user_data):
    response = client.post("/conversations", json={})
    assert response.status_code == 201
    data = response.json()
    assert "user_id" in data
    assert data["llm_id"] == 1 
    assert data["title"] == "Untitled"
    assert "created_at" in data
