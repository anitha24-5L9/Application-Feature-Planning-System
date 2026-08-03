from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.services.analytics_service import AnalyticsService
from app.services.analytics_sync_service import AnalyticsSyncService

from app.models.evaluation_analytics import EvaluationAnalytics


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


# Existing Redis Debug API
@router.get("/debug")
def get_all_analytics():
    return AnalyticsService.get_all_counters()


# Existing Redis Debug API
@router.get("/debug/{flag_key}")
def get_flag_analytics(flag_key: str):
    return AnalyticsService.get_flag_counters(flag_key)



# New Part-2 API
# Redis --> SQLite Sync

@router.post("/sync")
def sync_analytics(
    db: Session = Depends(get_db)
):

    return AnalyticsSyncService.sync(db)



# New Part-2 API
# Read stored analytics from SQLite

@router.get("/")
def get_saved_analytics(
    db: Session = Depends(get_db)
):

    analytics = db.query(
        EvaluationAnalytics
    ).all()

    return analytics