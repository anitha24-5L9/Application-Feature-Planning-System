from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def get_existing_flag():
    """
    Get an existing feature flag from database.
    No hardcoded/dummy flag key.
    """

    response = client.get("/flags/")

    assert response.status_code == 200

    flags = response.json()

    assert len(flags) > 0

    return flags[0]["key"]


def test_create_group_targeting_rule():

    flag_key = get_existing_flag()

    response = client.post(
        "/targeting/groups/",
        json={
            "flag_key": flag_key,
            "group_name": "beta_users"
        }
    )

    assert response.status_code in [200, 201]

    data = response.json()

    assert data["group_name"] == "beta_users"


def test_get_group_targeting_rules():

    flag_key = get_existing_flag()

    response = client.get(
        f"/targeting/groups/{flag_key}"
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)