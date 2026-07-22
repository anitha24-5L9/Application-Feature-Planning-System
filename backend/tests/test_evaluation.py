from app.services.evaluation import evaluate_flag, is_user_in_rollout

from app.models.flag import Flag
from app.models.environment import Environment
from app.models.environment_override import EnvironmentOverride
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership



def create_flag(db, key="test_feature"):

    flag = Flag(
        key=key,
        type="boolean",
        default_value="false",
        enabled=True,
        rollout_percentage=0,
        description="Test Feature",
        owner_team="Testing"
    )

    db.add(flag)
    db.commit()
    db.refresh(flag)

    return flag



def create_environment(db, name):

    environment = Environment(
        name=name
    )

    db.add(environment)
    db.commit()
    db.refresh(environment)

    return environment



# -----------------------------
# Default Value
# -----------------------------

def test_default_value(db):

    flag = create_flag(db)

    result = evaluate_flag(
        db,
        flag.key,
        "development"
    )

    assert result["success"] is True
    assert result["enabled"] == "false"
    assert result["reason"] == "Default Value"



# -----------------------------
# Environment Override TRUE
# -----------------------------

def test_environment_override_true(db):

    flag = create_flag(db)

    environment = create_environment(
        db,
        "production"
    )


    override = EnvironmentOverride(
        flag_id=flag.id,
        environment_id=environment.id,
        override_value=True
    )

    db.add(override)
    db.commit()


    result = evaluate_flag(
        db,
        flag.key,
        "production"
    )


    assert result["enabled"] is True
    assert result["reason"] == "Environment Override"



# -----------------------------
# Environment Override FALSE
# -----------------------------

def test_environment_override_false(db):

    flag = create_flag(db)

    environment = create_environment(
        db,
        "staging"
    )


    override = EnvironmentOverride(
        flag_id=flag.id,
        environment_id=environment.id,
        override_value=False
    )


    db.add(override)
    db.commit()


    result = evaluate_flag(
        db,
        flag.key,
        "staging"
    )


    assert result["enabled"] is False
    assert result["reason"] == "Environment Override"



# -----------------------------
# Different environments
# -----------------------------

def test_multiple_environment_values(db):

    flag = create_flag(db)


    dev = create_environment(
        db,
        "development"
    )

    prod = create_environment(
        db,
        "production"
    )


    db.add_all([

        EnvironmentOverride(
            flag_id=flag.id,
            environment_id=dev.id,
            override_value=True
        ),

        EnvironmentOverride(
            flag_id=flag.id,
            environment_id=prod.id,
            override_value=False
        )

    ])

    db.commit()


    dev_result = evaluate_flag(
        db,
        flag.key,
        "development"
    )


    prod_result = evaluate_flag(
        db,
        flag.key,
        "production"
    )


    assert dev_result["enabled"] is True

    assert prod_result["enabled"] is False



# -----------------------------
# Invalid Environment
# -----------------------------

def test_invalid_environment(db):

    flag = create_flag(db)


    result = evaluate_flag(
        db,
        flag.key,
        "invalid"
    )


    assert result["success"] is False



# -----------------------------
# Missing Flag
# -----------------------------

def test_missing_flag(db):


    result = evaluate_flag(
        db,
        "does_not_exist",
        "development"
    )


    assert result["success"] is False
    assert result["message"] == "Feature flag not found"



# -----------------------------
# Disabled Flag
# -----------------------------

def test_disabled_flag(db):

    flag = Flag(

        key="disabled_feature",
        type="boolean",
        default_value="true",
        enabled=False,
        rollout_percentage=0,
        description="Disabled",
        owner_team="Testing"

    )


    db.add(flag)
    db.commit()


    result = evaluate_flag(
        db,
        flag.key,
        "development"
    )


    assert result["enabled"] is False



# -----------------------------
# Rollout Tests
# -----------------------------

def test_rollout_zero():

    result = is_user_in_rollout(
        "user1",
        "feature",
        0
    )

    assert result is False



def test_rollout_hundred():

    result = is_user_in_rollout(
        "user1",
        "feature",
        100
    )


    assert result is True



def test_rollout_consistency():

    first = is_user_in_rollout(
        "user1",
        "feature",
        50
    )


    second = is_user_in_rollout(
        "user1",
        "feature",
        50
    )


    assert first == second