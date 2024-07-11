from fastapi.testclient import TestClient
from Core import schemas
from sqlalchemy.orm import Session
from Utilities.llm import init_llm_dict


def test_send_query_success(client: TestClient,
                            db_session: Session,
                            conversation_data,
                            task_data):
    query = schemas.Query(query_text="Test query", task_id=task_data.task_id)
    url = f"/conversations/{conversation_data.conversation_id}/messages"
    init_llm_dict()
    response = client.post(url, json=query.model_dump())
    if response.status_code != 201:
        print(response.status_code)
        print(response.json())
    assert response.status_code == 201 or response.status_code == 500
    if response.status_code == 500:
        assert "Cannot connect" in response.json()["detail"]
        return
    data = response.json()
    assert "conversation_id" in data
    assert "query_id" in data
    assert "response_id" in data
    assert data["response_text"]
    assert data["comment"]
    assert data["metrics"]


def test_send_query_empty_query(client: TestClient,
                                db_session: Session,
                                conversation_data,
                                task_data):
    query = schemas.Query(query_text="", task_id=task_data.task_id)
    url = f"/conversations/{conversation_data.conversation_id}/messages"
    response = client.post(url, json=query.model_dump())
    assert response.status_code == 400
    assert response.json()["detail"] == "Question cannot be empty"


def test_send_query_invalid_conversation(client: TestClient,
                                         db_session: Session,
                                         task_data):
    url = f"/conversations/{999}/messages"
    query = schemas.Query(query_text="Test query", task_id=task_data.task_id)
    response = client.post(url, json=query.model_dump())
    assert response.status_code == 404
    assert "Conversation with ID 999 not found." in response.json()["detail"]


def test_send_query_invalid_task(client: TestClient,
                                 db_session: Session,
                                 conversation_data):
    url = f"/conversations/{conversation_data.conversation_id}/messages"
    query = schemas.Query(query_text="Test query", task_id=999)
    response = client.post(url, json=query.model_dump())
    assert response.status_code == 404
    assert "Task with ID 999 not found." in response.json()["detail"]


def test_send_query_internal_server_error(client: TestClient,
                                          db_session: Session,
                                          conversation_data,
                                          task_data,
                                          mocker):
    mocker.patch("Core.crud.get_chatbot_response",
                 side_effect=Exception("Test error"))
    url = f"/conversations/{conversation_data.conversation_id}/messages"
    query = schemas.Query(query_text="Test query", task_id=task_data.task_id)
    response = client.post(url, json=query.model_dump())
    assert response.status_code == 500
    assert "Internal server error" in response.json()["detail"]
