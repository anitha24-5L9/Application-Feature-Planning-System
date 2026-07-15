from sqlalchemy.orm import Session

from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership

VALID_ENVIRONMENTS = [
    "development",
    "staging",
    "production"
]


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
            "enabled": False
        }

    # -----------------------------
    # User Context
    # -----------------------------
    user_id = None

    if user_context:
        user_id = user_context.get("user_id")

    # -----------------------------
    # Day 7 - User Targeting Rule
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
                "enabled": True
            }

    # -----------------------------
    # Day 8 - Group Targeting Rule
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
                    "enabled": True
                }

    # -----------------------------
    # Default Evaluation
    # -----------------------------
    return {
        "success": True,
        "flag": flag.key,
        "environment": environment,
        "enabled": flag.enabled
    }