import json

from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import SessionLocal

from app.services.audit_service import get_all_logs

router = APIRouter(
    prefix="/audit",
    tags=["Audit Logs"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.get("/")
def read_logs(
    db: Session = Depends(get_db)
):

    logs = get_all_logs(db)

    result = []

    for log in logs:

        result.append(
            {
                "id": log.id,
                "action": log.action,
                "actor": log.performed_by,
                "flag_key": log.flag_key,
                "timestamp": log.timestamp,
                "details": json.loads(log.details)
                if log.details
                else {}
            }
        )

    return result