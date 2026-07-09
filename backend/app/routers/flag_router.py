from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.schemas.flag import FlagCreate, FlagUpdate, FlagResponse
from app.services.flag_service import (
    get_flags,
    get_flag_by_key,
    create_flag,
    update_flag,
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
    return create_flag(db, flag)


@router.put("/{key}", response_model=FlagResponse)
def edit_flag(key: str, flag: FlagUpdate, db: Session = Depends(get_db)):
    updated = update_flag(db, key, flag)

    if not updated:
        raise HTTPException(status_code=404, detail="Flag not found")

    return updated