from fastapi import FastAPI
from app.cache.redis_client import check_redis_connection
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.models.environment_override import EnvironmentOverride
from app.routers.environment_override_router import router as environment_override_router
from app.routers.audit_router import router as audit_router

from app.routers import cleanup_router

# Import all models so SQLAlchemy creates the tables
from app.models import *

# Create all database tables
Base.metadata.create_all(bind=engine)

# Import Routers
from app.routers.flag_router import router as flag_router
from app.routers.evaluation import router as evaluation_router
from app.routers.targeting_router import router as targeting_router
from app.routers.environment_router import router as environment_router
from app.routers.analytics_router import router as analytics_router
from app.routers.auth import router as auth_router

app = FastAPI(
    title="Application Feature Planning and Release Governance System",
    version="1.0.0"
)

# Check Redis when the application starts
check_redis_connection()

# Register Routers
app.include_router(flag_router)
app.include_router(evaluation_router)
app.include_router(targeting_router)
app.include_router(environment_router)
app.include_router(environment_override_router)

app.include_router(audit_router)
app.include_router(analytics_router)
app.include_router(auth_router)

app.include_router(cleanup_router.router)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Application Feature Planning and Release Governance System"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": "SQLite Connected"
    }