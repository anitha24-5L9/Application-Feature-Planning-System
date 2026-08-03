from sqlalchemy.orm import Session

from app.models.flag import Flag
from app.schemas.flag import FlagCreate, FlagUpdate
from app.cache.redis_client import clear_flag_cache
from app.services.audit_service import create_audit_log


def get_flags(db: Session):
    return db.query(Flag).all()


def get_flag_by_key(db: Session, key: str):
    return db.query(Flag).filter(Flag.key == key).first()


def create_flag(
    db: Session,
    flag: FlagCreate,
    actor: str
):

    existing_flag = (
        db.query(Flag)
        .filter(Flag.key == flag.key)
        .first()
    )

    if existing_flag:
        return None

    db_flag = Flag(**flag.model_dump())

    db.add(db_flag)

    db.commit()

    db.refresh(db_flag)

    create_audit_log(
        db=db,
        action="CREATE",
        actor=actor,
        flag_key=db_flag.key,
        environment="All",
        before={},
        after={
            "key": db_flag.key,
            "enabled": db_flag.enabled,
            "rollout_percentage": db_flag.rollout_percentage,
            "default_value": db_flag.default_value
        }
    )

    clear_flag_cache(db_flag.key)

    return db_flag


def update_flag(
    db: Session,
    key: str,
    flag: FlagUpdate,
    actor: str
):

    db_flag = (
        db.query(Flag)
        .filter(Flag.key == key)
        .first()
    )

    if not db_flag:
        return None

    before = {
        "enabled": db_flag.enabled,
        "default_value": db_flag.default_value,
        "description": db_flag.description,
        "owner_team": db_flag.owner_team,
        "rollout_percentage": db_flag.rollout_percentage
    }

    updates = flag.model_dump(exclude_unset=True)

    for k, v in updates.items():
        setattr(db_flag, k, v)

    db.commit()

    db.refresh(db_flag)

    after = {
        "enabled": db_flag.enabled,
        "default_value": db_flag.default_value,
        "description": db_flag.description,
        "owner_team": db_flag.owner_team,
        "rollout_percentage": db_flag.rollout_percentage
    }

    if "enabled" in updates:
        action = "ENABLE" if db_flag.enabled else "DISABLE"
    else:
        action = "UPDATE"

    create_audit_log(
        db=db,
        action=action,
        actor=actor,
        flag_key=db_flag.key,
        environment="All",
        before=before,
        after=after
    )

    clear_flag_cache(db_flag.key)

    return db_flag


def get_rollout_percentage(
    db: Session,
    flag_key: str
):

    flag = (
        db.query(Flag)
        .filter(Flag.key == flag_key)
        .first()
    )

    if not flag:
        return None

    return {
        "flag_key": flag.key,
        "rollout_percentage": flag.rollout_percentage
    }


def update_rollout_percentage(
    db: Session,
    flag_key: str,
    rollout_percentage: int,
    actor: str
):

    flag = (
        db.query(Flag)
        .filter(Flag.key == flag_key)
        .first()
    )

    if not flag:
        return None

    before = {
        "rollout_percentage": flag.rollout_percentage
    }

    flag.rollout_percentage = rollout_percentage

    db.commit()

    db.refresh(flag)

    after = {
        "rollout_percentage": flag.rollout_percentage
    }

    create_audit_log(
        db=db,
        action="ROLLOUT_UPDATE",
        actor=actor,
        flag_key=flag.key,
        environment="All",
        before=before,
        after=after
    )

    clear_flag_cache(flag.key)

    return {
        "flag_key": flag.key,
        "rollout_percentage": flag.rollout_percentage
    }