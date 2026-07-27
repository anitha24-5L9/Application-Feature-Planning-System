# backend/tests/test_day13_integration.py

from app.services.evaluation import evaluate_flag

from app.cache.redis_client import (
    redis_client,
    clear_flag_cache
)

from app.models.flag import Flag
from app.models.environment import Environment
from app.models.environment_override import EnvironmentOverride
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership


# ---------------------------------------------------
# Helpers
# ---------------------------------------------------

def create_flag(db):
    flag = Flag(
        key="day13-feature",
        type="boolean",
        default_value="false",
        enabled=True,
        rollout_percentage=50,
        description="Integration Test",
        owner_team="Testing"
    )

    db.add(flag)
    db.commit()
    db.refresh(flag)

    return flag


def create_environment(db):
    env = Environment(
        name="production"
    )

    db.add(env)
    db.commit()
    db.refresh(env)

    return env


def clear_cache():
    clear_flag_cache("day13-feature")


# ---------------------------------------------------
# Test 1
# User Targeting has highest priority
# ---------------------------------------------------

def test_user_targeting_priority(db):

    clear_cache()

    flag = create_flag(db)

    env = create_environment(db)

    db.add(
        EnvironmentOverride(
            flag_id=flag.id,
            environment_id=env.id,
            override_value=False
        )
    )

    db.add(
        TargetingRule(
            flag_id=flag.id,
            user_id="anitha"
        )
    )

    db.commit()

    result = evaluate_flag(
        db,
        flag.key,
        "production",
        {
            "user_id": "anitha"
        }
    )

    assert result["success"] is True
    assert result["reason"] == "User Targeting"
    assert result["enabled"] is True


# ---------------------------------------------------
# Test 2
# Group Targeting has priority over Rollout
# ---------------------------------------------------

def test_group_targeting_priority(db):

    clear_cache()

    flag = create_flag(db)

    db.add(
        UserGroupMembership(
            user_id="rahul",
            group_name="beta_users"
        )
    )

    db.add(
        TargetingRule(
            flag_id=flag.id,
            group_name="beta_users"
        )
    )

    db.commit()

    result = evaluate_flag(
        db,
        flag.key,
        "development",
        {
            "user_id": "rahul"
        }
    )

    assert result["success"] is True
    assert result["reason"] == "Group Targeting"
    assert result["enabled"] is True


# ---------------------------------------------------
# Test 3
# Cache should be used on second request
# ---------------------------------------------------

def test_cache_hit(db):

    clear_cache()

    flag = create_flag(db)

    first = evaluate_flag(
        db,
        flag.key,
        "development",
        {
            "user_id": "cache_user"
        }
    )

    assert first["source"] == "live"

    second = evaluate_flag(
        db,
        flag.key,
        "development",
        {
            "user_id": "cache_user"
        }
    )

    assert second["source"] == "cache"


# ---------------------------------------------------
# Test 4
# Cache invalidation after rollout update
# ---------------------------------------------------

def test_cache_invalidation_after_rollout_change(db):

    clear_cache()

    flag = create_flag(db)

    evaluate_flag(
        db,
        flag.key,
        "development",
        {
            "user_id": "cache_user"
        }
    )

    flag.rollout_percentage = 100

    db.commit()

    clear_flag_cache(flag.key)

    result = evaluate_flag(
        db,
        flag.key,
        "development",
        {
            "user_id": "cache_user"
        }
    )

    assert result["source"] == "live"


# ---------------------------------------------------
# Test 5
# Environment Override after rollout
# ---------------------------------------------------

def test_environment_override_used(db):

    clear_cache()

    flag = create_flag(db)

    env = create_environment(db)

    db.add(
        EnvironmentOverride(
            flag_id=flag.id,
            environment_id=env.id,
            override_value=True
        )
    )

    db.commit()

    result = evaluate_flag(
        db,
        flag.key,
        "production",
        {
            "user_id": "random_user"
        }
    )

    assert result["success"] is True
    assert result["reason"] == "Environment Override"
    assert result["enabled"] is True