from sqlalchemy.orm import Session
from app.models.flag import Flag


def evaluate_flag(db: Session, flag_key: str, environment: str):
    flag = db.query(Flag).filter(Flag.key == flag_key).first()

    if not flag:
        return {
            "success": False,
            "message": "Flag not found"
        }

    # Day 4 logic
    # Currently only checks enabled/disabled state.
    # Environment override will be added later.

    return {
        "success": True,
        "flag": flag.key,
        "environment": environment,
        "enabled": flag.enabled
    }