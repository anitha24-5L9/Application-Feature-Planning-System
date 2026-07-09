from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

# Import all models so SQLAlchemy creates the tables
from app.models import *

# Create all database tables
Base.metadata.create_all(bind=engine)

# Import Routers
from app.routers.flag_router import router as flag_router
from app.routers.evaluation import router as evaluation_router

app = FastAPI(
    title="Application Feature Planning and Release Governance System",
    version="1.0.0"
)

# Register Routers
app.include_router(flag_router)
app.include_router(evaluation_router)

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