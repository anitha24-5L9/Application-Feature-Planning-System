from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.evaluation import EvaluationRequest
from app.services.evaluation import evaluate_flag

router = APIRouter(
    prefix="/evaluate",
    tags=["Evaluation"]
)


@router.post("/")
def evaluate(request: EvaluationRequest, db: Session = Depends(get_db)):
    return evaluate_flag(
    db,
    request.flag_key,
    request.environment,
    request.user_context
)