from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.targeting import (
    TargetUserCreate,
    TargetUserResponse,
    MessageResponse,
)

from app.services.targeting_service import (
    add_target_user,
    get_target_users,
    delete_target_user,
)

router = APIRouter(
    prefix="/targeting/users",
    tags=["Targeting Rules"],
)


@router.post("/", response_model=MessageResponse)
def create_target_user(
    request: TargetUserCreate,
    db: Session = Depends(get_db),
):

    result = add_target_user(
        db,
        request.flag_key,
        request.user_id,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Feature flag not found",
        )

    return {
        "message": "User targeting rule added"
    }


@router.get(
    "/{flag_key}",
    response_model=list[TargetUserResponse],
)
def list_target_users(
    flag_key: str,
    db: Session = Depends(get_db),
):

    return get_target_users(db, flag_key)


@router.delete(
    "/{flag_key}/{user_id}",
    response_model=MessageResponse,
)
def remove_target_user(
    flag_key: str,
    user_id: str,
    db: Session = Depends(get_db),
):

    deleted = delete_target_user(
        db,
        flag_key,
        user_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Targeting rule not found",
        )

    return {
        "message": "Rule removed"
    }