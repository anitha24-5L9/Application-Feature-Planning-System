from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_existing_flag():
    """
    Get existing feature flag from database.
    No dummy flag key.
    """

    response = client.get("/flags/")

    assert response.status_code == 200

    flags = response.json()

    assert len(flags) > 0

    return flags[0]["key"]


def test_group_user_gets_feature_flag():

    flag_key = get_existing_flag()

    response = client.post(
        "/evaluate/",
        json={
            "flag_key": flag_key,
            "environment": "Production",
            "user_context": {
                "user_id": "Anitha",
                "groups": [
                    "beta_users"
                ]
            }
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "enabled" in data



def test_unknown_user_evaluation():

    flag_key = get_existing_flag()

    response = client.post(
        "/evaluate/",
        json={
            "flag_key": flag_key,
            "environment": "Production",
            "user_context": {
                "user_id": "unknown_user",
                "groups": []
            }
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "enabled" in data