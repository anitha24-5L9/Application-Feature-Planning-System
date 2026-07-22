from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.environment import (
    EnvironmentCreate,
    EnvironmentUpdate,
    EnvironmentResponse,
)

from app.services.environment_service import (
    create_environment,
    get_environments,
    get_environment,
    update_environment,
    delete_environment,
)

router = APIRouter(
    prefix="/environments",
    tags=["Environments"],
)


@router.post("/", response_model=EnvironmentResponse)
def create(data: EnvironmentCreate, db: Session = Depends(get_db)):
    env = create_environment(db, data.name)

    if env is None:
        raise HTTPException(
            status_code=400,
            detail="Environment already exists",
        )

    return env


@router.get("/", response_model=list[EnvironmentResponse])
def list_all(db: Session = Depends(get_db)):
    return get_environments(db)


@router.get("/{env_id}", response_model=EnvironmentResponse)
def get_one(env_id: int, db: Session = Depends(get_db)):
    env = get_environment(db, env_id)

    if env is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found",
        )

    return env


@router.put("/{env_id}", response_model=EnvironmentResponse)
def update(
    env_id: int,
    data: EnvironmentUpdate,
    db: Session = Depends(get_db),
):
    env = update_environment(db, env_id, data.name)

    if env is None:
        raise HTTPException(
            status_code=404,
            detail="Environment not found",
        )

    return env


@router.delete("/{env_id}")
def delete(env_id: int, db: Session = Depends(get_db)):
    success = delete_environment(db, env_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail="Environment not found",
        )

    return {"message": "Environment deleted successfully"}