# TODO: remove unused imports (flake8)
# import pytest
from fastapi.testclient import TestClient
# from datetime import datetime
from sqlalchemy.orm import Session
# from Core.models import Feedback, Message, Conversation
# from Core import schemas
# from fastapi import HTTPException


# TODO: possibly need to rename (flake8)
def test_calculate_personal_statistics_success(client: TestClient,
                                               db_session: Session,
                                               user_data,
                                               message_data):
    response = client.get("/profile/statistics", params={
                                                "user_id": user_data.user_id})
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "total_activity" in data
    assert "daily_activity" in data
    assert data["metrics"]["criterion_1"] == 4.0
    assert data["metrics"]["criterion_2"] == 3.5
    assert data["metrics"]["criterion_3"] == 2.0
    assert data["metrics"]["criterion_4"] == 1.0


# TODO: possibly need to rename (flake8)
def test_calculate_personal_statistics_no_data(client: TestClient,
                                               db_session: Session,
                                               user_data):
    response = client.get("/profile/statistics", params={
                                                "user_id": user_data.user_id})
    assert response.status_code == 404
    assert "detail" in response.json()
    assert response.json()["detail"] in [
        f"Personal statistics not found for user ID {user_data.user_id}.",
        f"Total activity not found for user ID {user_data.user_id}.",
        f"Daily activity not found for user ID {user_data.user_id}."
    ]


# TODO: possibly need to rename (flake8)
def test_calculate_personal_statistics_invalid_user_id(client: TestClient):
    response = client.get("/profile/statistics", params={
                                                "user_id": 9999})
    assert response.status_code == 404
    assert "detail" in response.json()
    assert response.json()["detail"] in [
        f"Personal statistics not found for user ID {9999}.",
        f"Total activity not found for user ID {9999}.",
        f"Daily activity not found for user ID {9999}."
    ]


# TODO: possibly need to rename (flake8)
def test_calculate_personal_statistics_incomplete_data(client: TestClient,
                                                       db_session: Session,
                                                       user_data,
                                                       conversation_data):
    response = client.get("/profile/statistics", params={
                                                "user_id": user_data.user_id})
    assert response.status_code == 404
    assert "detail" in response.json()
    assert response.json()["detail"] in [
        f"Personal statistics not found for user ID {user_data.user_id}.",
        f"Total activity not found for user ID {user_data.user_id}.",
        f"Daily activity not found for user ID {user_data.user_id}."
    ]
