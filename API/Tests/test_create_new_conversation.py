from fastapi.testclient import TestClient



def test_create_conversation(client: TestClient, llm_id, user_data):
    response = client.post("/conversations",
                           json=llm_id,
                           params={
                               "user_id": user_data.user_id})
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == user_data.user_id
    assert data["llm_id"] == llm_id["llm_id"]
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
