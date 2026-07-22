from sqlalchemy.orm import Session

from app.models.flag import Flag
from app.models.environment import Environment
from app.models.environment_override import EnvironmentOverride


def create_or_update_override(
    db: Session,
    flag_key: str,
    environment_name: str,
    override_value: bool,
):
    flag = db.query(Flag).filter(
        Flag.key == flag_key
    ).first()

    if not flag:
        return None

    environment = db.query(Environment).filter(
        Environment.name == environment_name
    ).first()

    if not environment:
        return "environment_not_found"

    override = db.query(EnvironmentOverride).filter(
        EnvironmentOverride.flag_id == flag.id,
        EnvironmentOverride.environment_id == environment.id,
    ).first()

    if override:
        override.override_value = override_value

    else:
        override = EnvironmentOverride(
            flag_id=flag.id,
            environment_id=environment.id,
            override_value=override_value,
        )

        db.add(override)

    db.commit()
    db.refresh(override)

    return {
        "id": override.id,
        "flag_key": flag.key,
        "environment_name": environment.name,
        "override_value": override.override_value,
    }


def get_overrides(db: Session, flag_key: str):

    flag = db.query(Flag).filter(
        Flag.key == flag_key
    ).first()

    if not flag:
        return None

    overrides = db.query(EnvironmentOverride).filter(
        EnvironmentOverride.flag_id == flag.id
    ).all()

    result = []

    for item in overrides:

        environment = db.query(Environment).filter(
            Environment.id == item.environment_id
        ).first()

        result.append(
            {
                "id": item.id,
                "flag_key": flag.key,
                "environment_name": environment.name,
                "override_value": item.override_value,
            }
        )

    return result