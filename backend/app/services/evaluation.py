import hashlib
from sqlalchemy.orm import Session

from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership
from app.models.environment import Environment
from app.models.environment_override import EnvironmentOverride


VALID_ENVIRONMENTS = [
    "development",
    "staging",
    "production"
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


def evaluate_flag(
    db: Session,
    flag_key: str,
    environment: str,
    user_context: dict | None = None
):

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

    # -----------------------------
    # Disabled Flag
    # -----------------------------
    if not flag.enabled:
        return {
    "success": True,
    "flag": flag.key,
    "environment": environment,
    "enabled": False,
    "reason": "Flag Disabled",
    "matched_rule": "Feature flag is disabled"
}

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
            return {
    "success": True,
    "flag": flag.key,
    "environment": environment,
    "enabled": True,
    "reason": "User Targeting",
    "matched_rule": f"User ID: {user_id}"
}

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
                return {
    "success": True,
    "flag": flag.key,
    "environment": environment,
    "enabled": True,
    "reason": "Group Targeting",
    "matched_rule": f"Groups: {', '.join(user_groups)}"
}

    # -----------------------------
    # Day 9 - Percentage Rollout
    # -----------------------------
    if user_id:

        if is_user_in_rollout(
            user_id=user_id,
            flag_key=flag.key,
            rollout_percentage=flag.rollout_percentage
        ):
            return {
    "success": True,
    "flag": flag.key,
    "environment": environment,
    "enabled": True,
    "reason": "Percentage Rollout",
    "matched_rule": f"Rollout: {flag.rollout_percentage}%"
}

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
            return {
    "success": True,
    "flag": flag.key,
    "environment": environment,
    "enabled": override.override_value,
    "reason": "Environment Override",
    "matched_rule": f"Environment: {environment.lower()}"
}

    # -----------------------------
    # Default Value
    # -----------------------------
    return {
    "success": True,
    "flag": flag.key,
    "environment": environment,
    "enabled": flag.default_value,
    "reason": "Default Value",
    "matched_rule": "No targeting rule matched"
}