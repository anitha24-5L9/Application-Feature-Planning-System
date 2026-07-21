from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.schemas.flag import (
    FlagCreate,
    FlagUpdate,
    FlagResponse,
    RolloutUpdate,
    RolloutResponse,
)
from app.services.flag_service import (
    get_flags,
    get_flag_by_key,
    create_flag,
    update_flag,
    get_rollout_percentage,
    update_rollout_percentage,
)

router = APIRouter(prefix="/flags", tags=["Flags"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[FlagResponse])
def read_flags(db: Session = Depends(get_db)):
    return get_flags(db)


@router.get("/{key}", response_model=FlagResponse)
def read_flag(key: str, db: Session = Depends(get_db)):
    flag = get_flag_by_key(db, key)

    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    return flag


@router.post("/", response_model=FlagResponse)
def add_flag(flag: FlagCreate, db: Session = Depends(get_db)):
    new_flag = create_flag(db, flag)

    if not new_flag:
        raise HTTPException(
            status_code=409,
            detail="Feature key already exists"
        )

    return new_flag


@router.put("/{key}", response_model=FlagResponse)
def edit_flag(key: str, flag: FlagUpdate, db: Session = Depends(get_db)):
    updated = update_flag(db, key, flag)

    if not updated:
        raise HTTPException(status_code=404, detail="Flag not found")

    return updated
@router.get("/{key}/rollout", response_model=RolloutResponse)
def read_rollout(key: str, db: Session = Depends(get_db)):

    result = get_rollout_percentage(db, key)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Flag not found"
        )

    return result
@router.put("/{key}/rollout", response_model=RolloutResponse)
def edit_rollout(
    key: str,
    rollout: RolloutUpdate,
    db: Session = Depends(get_db)
):

    result = update_rollout_percentage(
        db,
        key,
        rollout.rollout_percentage
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Flag not found"
        )

    return result