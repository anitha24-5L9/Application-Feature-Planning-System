from sqlalchemy.orm import Session
from app.models.flag import Flag
from app.schemas.flag import FlagCreate, FlagUpdate


def get_flags(db: Session):
    return db.query(Flag).all()


def get_flag_by_key(db: Session, key: str):
    return db.query(Flag).filter(Flag.key == key).first()

def create_flag(db: Session, flag: FlagCreate):
    # Check if the feature key already exists
    existing_flag = db.query(Flag).filter(Flag.key == flag.key).first()

    if existing_flag:
        return None

    db_flag = Flag(**flag.model_dump())
    db.add(db_flag)
    db.commit()
    db.refresh(db_flag)

    return db_flag


def update_flag(db: Session, key: str, flag: FlagUpdate):
    db_flag = db.query(Flag).filter(Flag.key == key).first()

    if not db_flag:
        return None

    updates = flag.model_dump(exclude_unset=True)

    for k, v in updates.items():
        setattr(db_flag, k, v)

    db.commit()
    db.refresh(db_flag)

    return db_flag

def get_rollout_percentage(db, flag_key):

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
    db,
    flag_key,
    rollout_percentage
):

    flag = (
        db.query(Flag)
        .filter(Flag.key == flag_key)
        .first()
    )

    if not flag:
        return None

    flag.rollout_percentage = rollout_percentage

    db.commit()

    db.refresh(flag)

    return {
        "flag_key": flag.key,
        "rollout_percentage": flag.rollout_percentage
    }