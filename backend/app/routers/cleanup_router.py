from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.services.cleanup_service import CleanupService

router = APIRouter(
    prefix="/cleanup",
    tags=["Cleanup"]
)


@router.get("/suggestions")
def get_cleanup_suggestions(
    days: int = 30,
    db: Session = Depends(get_db)
):
    return CleanupService.get_cleanup_candidates(db, days)


@router.put("/review/{flag_key}")
def review_cleanup_flag(
    flag_key: str,
    db: Session = Depends(get_db)
):
    flag = CleanupService.mark_reviewed(
        db,
        flag_key
    )

    if flag is None:
        raise HTTPException(
            status_code=404,
            detail="Flag not found"
        )

    return {
        "message": "Cleanup suggestion reviewed."
    }