from sqlalchemy.orm import Session

from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule

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
    # Day 7 - User Targeting Rule
    # -----------------------------
    user_id = None

    if user_context:
        user_id = user_context.get("user_id")

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
    # Default Evaluation
    # -----------------------------
    return {
        "success": True,
        "flag": flag.key,
        "environment": environment,
        "enabled": flag.enabled
    }