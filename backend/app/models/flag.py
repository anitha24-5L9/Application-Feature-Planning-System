from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.database.database import Base


class Flag(Base):
    __tablename__ = "flags"

    id = Column(Integer, primary_key=True, index=True)

    key = Column(String, unique=True, index=True, nullable=False)

    type = Column(String, nullable=False)

    default_value = Column(String, nullable=False)

    enabled = Column(Boolean, default=True)

    rollout_percentage = Column(Integer, default=0)

    description = Column(String)

    owner_team = Column(String, nullable=False)

    # -------------------------
    # Day 17 Cleanup Fields
    # -------------------------

    cleanup_status_since = Column(DateTime, default=datetime.utcnow)

    cleanup_reviewed = Column(Boolean, default=False)