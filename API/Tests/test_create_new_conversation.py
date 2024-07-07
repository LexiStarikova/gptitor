import pytest
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from Core import models, schemas, crud
from Core.main import app

def test_create_conversation(client: TestClient, llm_data, user_data):
    response = client.post("/conversations", json=llm_data, params={"user_id": user_data.user_id})
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == user_data.user_id
    assert data["llm_id"] == llm_data["llm_id"]
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
