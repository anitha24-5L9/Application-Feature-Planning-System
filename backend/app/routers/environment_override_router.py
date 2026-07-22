from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.environment_override import (
    EnvironmentOverrideCreate,
    EnvironmentOverrideResponse,
)

from app.services.environment_override_service import (
    create_or_update_override,
    get_overrides,
)

router = APIRouter(
    prefix="/environment-overrides",
    tags=["Environment Overrides"],
)


@router.post(
    "/",
    response_model=EnvironmentOverrideResponse,
)
def save_override(
    data: EnvironmentOverrideCreate,
    db: Session = Depends(get_db),
):

    result = create_or_update_override(
        db,
        data.flag_key,
        data.environment_name,
        data.override_value,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Flag not found",
        )

    if result == "environment_not_found":
        raise HTTPException(
            status_code=404,
            detail="Environment not found",
        )

    return result


@router.get(
    "/{flag_key}",
    response_model=list[EnvironmentOverrideResponse],
)
def list_overrides(
    flag_key: str,
    db: Session = Depends(get_db),
):

    result = get_overrides(
        db,
        flag_key,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Flag not found",
        )

    return result