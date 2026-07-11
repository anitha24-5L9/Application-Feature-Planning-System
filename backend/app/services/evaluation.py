from sqlalchemy.orm import Session
from app.models.flag import Flag


def evaluate_flag(
    db: Session,
    flag_key: str,
    environment: str,
    user_context: dict | None = None
):
    flag = db.query(Flag).filter(Flag.key == flag_key).first()

    if not flag:
        return {
            "success": False,
            "message": "Flag not found"
        }

    # Case 1
    # Disabled flag always returns False

    if not flag.enabled:
        return {
            "success": True,
            "flag": flag.key,
            "environment": environment,
            "enabled": False
        }

    # Case 2
    # Placeholder environment override

    if environment.lower() == "production":
        enabled = flag.enabled
    else:
        enabled = flag.enabled

    return {
        "success": True,
        "flag": flag.key,
        "environment": environment,
        "enabled": enabled
    }