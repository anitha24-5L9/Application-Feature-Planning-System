import hashlib
from sqlalchemy.orm import Session

from app.cache.redis_client import get_cache, set_cache

from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership
from app.models.environment import Environment
from app.models.environment_override import EnvironmentOverride
from app.services.analytics_service import AnalyticsService

VALID_ENVIRONMENTS = [
    "development",
    "testing",
    "staging",
    "production",
]


def is_user_in_rollout(
    user_id: str,
    flag_key: str,
    rollout_percentage: int
):
    if rollout_percentage <= 0:
        return False

    if rollout_percentage >= 100:
        return True

    value = f"{user_id}:{flag_key}"

    hash_value = hashlib.sha256(
        value.encode("utf-8")
    ).hexdigest()

    bucket = int(hash_value, 16) % 100

    return bucket < rollout_percentage


def cache_and_return(cache_key: str, response: dict):
    """
    Save response in Redis and return it.
    Error responses are not cached.
    """
    if response.get("success"):
        response["source"] = "live"
        set_cache(cache_key, response)

    return response


def evaluate_flag(
    db: Session,
    flag_key: str,
    environment: str,
    user_context: dict | None = None
):
    if user_context is None:
        user_context = {}

    environment = environment.strip().lower()

    user_id = user_context.get(
        "user_id",
        "anonymous"
    )

    cache_key = (
        f"{flag_key}:{environment}:{user_id}"
    )

    cached_result = get_cache(cache_key)

    if cached_result:
        # Count cached evaluation
        AnalyticsService.record_evaluation(flag_key)
        cached_result["source"] = "cache"
        return cached_result




    # -----------------------------
    # Validate Environment
    # -----------------------------
    if environment.lower() not in VALID_ENVIRONMENTS:
        return {
            "success": False,
            "message": "Invalid environment"
        }

    # -----------------------------
    # Find Feature Flag
    # -----------------------------
    flag = db.query(Flag).filter(
        Flag.key == flag_key
    ).first()

    if not flag:
        return {
            "success": False,
            "message": "Feature flag not found"
        }
    AnalyticsService.record_evaluation(flag_key)
    

    # -----------------------------
    # Disabled Flag
    # -----------------------------
    if not flag.enabled:
        return cache_and_return(
            cache_key,
            {
                "success": True,
                "flag": flag.key,
                "environment": environment,
                "enabled": False,
                "reason": "Flag Disabled",
                "matched_rule": "Feature flag is disabled"
            }
        )

    # -----------------------------
    # User Context
    # -----------------------------
    user_id = None

    if user_context:
        user_id = user_context.get("user_id")

    # -----------------------------
    # Day 7 - User Targeting
    # -----------------------------
    if user_id:

        targeted_user = (
            db.query(TargetingRule)
            .filter(
                TargetingRule.flag_id == flag.id,
                TargetingRule.user_id == user_id
            )
            .first()
        )

        if targeted_user:
            return cache_and_return(
                cache_key,
                {
                    "success": True,
                    "flag": flag.key,
                    "environment": environment,
                    "enabled": True,
                    "reason": "User Targeting",
                    "matched_rule": f"User ID: {user_id}"
                }
            )

    # -----------------------------
    # Day 8 - Group Targeting
    # -----------------------------
    if user_id:

        memberships = (
            db.query(UserGroupMembership)
            .filter(
                UserGroupMembership.user_id == user_id
            )
            .all()
        )

        user_groups = [
            membership.group_name
            for membership in memberships
        ]

        if user_groups:

            targeted_group = (
                db.query(TargetingRule)
                .filter(
                    TargetingRule.flag_id == flag.id,
                    TargetingRule.group_name.in_(user_groups)
                )
                .first()
            )

            if targeted_group:
                return cache_and_return(
                    cache_key,
                    {
                        "success": True,
                        "flag": flag.key,
                        "environment": environment,
                        "enabled": True,
                        "reason": "Group Targeting",
                        "matched_rule": f"Groups: {', '.join(user_groups)}"
                    }
                )

    # -----------------------------
    # Day 9 - Percentage Rollout
    # -----------------------------
    if user_id:

        if is_user_in_rollout(
            user_id=user_id,
            flag_key=flag.key,
            rollout_percentage=flag.rollout_percentage
        ):
            return cache_and_return(
                cache_key,
                {
                    "success": True,
                    "flag": flag.key,
                    "environment": environment,
                    "enabled": True,
                    "reason": "Percentage Rollout",
                    "matched_rule": f"Rollout: {flag.rollout_percentage}%"
                }
            )

    # -----------------------------
    # Day 10 - Environment Override
    # -----------------------------
    environment_obj = (
        db.query(Environment)
        .filter(
            Environment.name == environment.lower()
        )
        .first()
    )

    if environment_obj:

        override = (
            db.query(EnvironmentOverride)
            .filter(
                EnvironmentOverride.flag_id == flag.id,
                EnvironmentOverride.environment_id == environment_obj.id
            )
            .first()
        )

        if override:
            return cache_and_return(
                cache_key,
                {
                    "success": True,
                    "flag": flag.key,
                    "environment": environment,
                    "enabled": override.override_value,
                    "reason": "Environment Override",
                    "matched_rule": f"Environment: {environment.lower()}"
                }
            )

    # -----------------------------
    # Default Value
    # -----------------------------
    default_enabled = str(
    flag.default_value
).lower() == "true"
    return cache_and_return(
    cache_key,
    {
        "success": True,
        "flag": flag.key,
        "environment": environment,
        "enabled": default_enabled,
        "reason": "Default Value",
        "matched_rule": "No targeting rule matched"
    }
)