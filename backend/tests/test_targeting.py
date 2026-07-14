from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_add_target_user():

    response = client.post(
        "/targeting/users/",
        json={
            "flag_key": "new-dashboard",
            "user_id": "tester01"
        }
    )

    assert response.status_code in [200, 404]


def test_get_target_users():

    response = client.get(
        "/targeting/users/new-dashboard"
    )

    assert response.status_code == 200

    assert isinstance(response.json(), list)


def test_delete_target_user():

    response = client.delete(
        "/targeting/users/new-dashboard/tester01"
    )

    assert response.status_code in [200, 404]