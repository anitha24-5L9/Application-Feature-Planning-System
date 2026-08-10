from sqlalchemy import create_engine
from sqlalchemy.orm import (
    sessionmaker,
    declarative_base
)


# ==========================================
# SQLite Database Configuration
# ==========================================

DATABASE_URL = "sqlite:///./feature_planning.db"

DATABASE_TYPE = "SQLite"

DATABASE_NAME = "feature_planning.db"


# ==========================================
# Database Engine
# ==========================================

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


# ==========================================
# Database Session
# ==========================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ==========================================
# SQLAlchemy Base
# ==========================================

Base = declarative_base()


# ==========================================
# FastAPI Database Dependency
# ==========================================

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()