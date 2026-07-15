from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.targeting import (
    TargetUserCreate,
    TargetUserResponse,
    TargetGroupCreate,
    TargetGroupResponse,
    MessageResponse,
)

from app.services.targeting_service import (
    add_target_user,
    get_target_users,
    delete_target_user as remove_target_user_rule,
    add_target_group,
    get_target_groups,
    remove_target_group,
)

router = APIRouter(
    prefix="/targeting",
    tags=["Targeting Rules"],
)


# -----------------------------
# User Targeting APIs
# -----------------------------

@router.post("/users/", response_model=MessageResponse)
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
    "/users/{flag_key}",
    response_model=list[TargetUserResponse],
)
def list_target_users(
    flag_key: str,
    db: Session = Depends(get_db),
):
    return get_target_users(db, flag_key)


@router.delete(
    "/users/{flag_key}/{user_id}",
    response_model=MessageResponse,
)
def delete_target_user(
    flag_key: str,
    user_id: str,
    db: Session = Depends(get_db),
):
    deleted = remove_target_user_rule(
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


# -----------------------------
# Group Targeting APIs
# -----------------------------

@router.post(
    "/groups/",
    response_model=TargetGroupResponse,
)
def create_target_group(
    request: TargetGroupCreate,
    db: Session = Depends(get_db),
):
    return add_target_group(db, request)


@router.get(
    "/groups/{flag_key}",
    response_model=list[TargetGroupResponse],
)
def list_target_groups(
    flag_key: str,
    db: Session = Depends(get_db),
):
    return get_target_groups(db, flag_key)


@router.delete(
    "/groups/{flag_key}/{group_name}",
    response_model=MessageResponse,
)
def delete_target_group(
    flag_key: str,
    group_name: str,
    db: Session = Depends(get_db),
):
    remove_target_group(
        db,
        flag_key,
        group_name,
    )

    return {
        "message": "Group removed successfully"
    }