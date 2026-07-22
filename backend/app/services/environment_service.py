from sqlalchemy.orm import Session
from app.models.environment import Environment


def create_environment(db: Session, name: str):
    existing = db.query(Environment).filter(
        Environment.name == name
    ).first()

    if existing:
        return None

    env = Environment(name=name)

    db.add(env)
    db.commit()
    db.refresh(env)

    return env


def get_environments(db: Session):
    return db.query(Environment).all()


def get_environment(db: Session, env_id: int):
    return db.query(Environment).filter(
        Environment.id == env_id
    ).first()


def update_environment(db: Session, env_id: int, name: str):
    env = get_environment(db, env_id)

    if not env:
        return None

    env.name = name

    db.commit()
    db.refresh(env)

    return env


def delete_environment(db: Session, env_id: int):
    env = get_environment(db, env_id)

    if not env:
        return False

    db.delete(env)
    db.commit()

    return True