from sqlalchemy.orm import Session

from app.models.flag import Flag
from app.models.targeting_rule import TargetingRule


def add_target_user(db: Session, flag_key: str, user_id: str):

    flag = (
        db.query(Flag)
        .filter(Flag.key == flag_key)
        .first()
    )

    if not flag:
        return None

    existing = (
        db.query(TargetingRule)
        .filter(
            TargetingRule.flag_id == flag.id,
            TargetingRule.user_id == user_id,
        )
        .first()
    )

    if existing:
        return existing

    rule = TargetingRule(
        flag_id=flag.id,
        user_id=user_id,
    )

    db.add(rule)
    db.commit()
    db.refresh(rule)

    return rule


def get_target_users(db: Session, flag_key: str):

    flag = (
        db.query(Flag)
        .filter(Flag.key == flag_key)
        .first()
    )

    if not flag:
        return []

    return (
        db.query(TargetingRule)
        .filter(TargetingRule.flag_id == flag.id)
        .all()
    )


def delete_target_user(db: Session, flag_key: str, user_id: str):

    flag = (
        db.query(Flag)
        .filter(Flag.key == flag_key)
        .first()
    )

    if not flag:
        return False

    rule = (
        db.query(TargetingRule)
        .filter(
            TargetingRule.flag_id == flag.id,
            TargetingRule.user_id == user_id,
        )
        .first()
    )

    if not rule:
        return False

    db.delete(rule)
    db.commit()

    return True