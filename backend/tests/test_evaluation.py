from app.services.evaluation import (
    evaluate_flag,
    is_user_in_rollout
)


class DummyFlag:
    def __init__(self, key, enabled):
        self.key = key
        self.enabled = enabled


class DummyQuery:
    def __init__(self, flag):
        self.flag = flag

    def filter(self, *args):
        return self

    def first(self):
        return self.flag


class DummyDB:
    def __init__(self, flag):
        self.flag = flag

    def query(self, model):
        return DummyQuery(self.flag)


def test_default_value_returned():
    db = DummyDB(DummyFlag("feature1", True))

    result = evaluate_flag(db, "feature1", "Development")

    assert result["enabled"] is True


def test_environment_override():
    db = DummyDB(DummyFlag("feature2", True))

    result = evaluate_flag(db, "feature2", "Production")

    assert result["environment"] == "Production"


def test_disabled_flag_returns_false():
    db = DummyDB(DummyFlag("feature3", False))

    result = evaluate_flag(db, "feature3", "Development")

    assert result["enabled"] is False


def test_empty_user_context():
    db = DummyDB(DummyFlag("feature4", True))

    result = evaluate_flag(
        db,
        "feature4",
        "Development",
        {}
    )

    assert result["success"] is True


def test_targeted_user_evaluation():

    db = DummyDB(DummyFlag("feature5", False))


    result = evaluate_flag(
        db,
        "feature5",
        "Development",
        {
            "user_id": "tester01"
        }
    )


    assert result["success"] is True

def test_rollout_zero_percent():

    result = is_user_in_rollout(
        user_id="anitha",
        flag_key="new_dashboard",
        rollout_percentage=0
    )

    assert result is False


def test_rollout_hundred_percent():

    result = is_user_in_rollout(
        user_id="anitha",
        flag_key="new_dashboard",
        rollout_percentage=100
    )

    assert result is True


def test_rollout_consistency():

    first = is_user_in_rollout(
        user_id="tester01",
        flag_key="payment",
        rollout_percentage=50
    )

    second = is_user_in_rollout(
        user_id="tester01",
        flag_key="payment",
        rollout_percentage=50
    )

    assert first == second


def test_rollout_returns_boolean():

    result = is_user_in_rollout(
        user_id="user123",
        flag_key="login",
        rollout_percentage=40
    )

    assert isinstance(result, bool)