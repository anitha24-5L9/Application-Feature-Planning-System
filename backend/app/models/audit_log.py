from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from app.database.database import Base


class AuditLog(Base):
    __tablename__ = "audit_log"

    id = Column(Integer, primary_key=True, index=True)

    action = Column(String, nullable=False)

    performed_by = Column(String, nullable=False)

    flag_key = Column(String, nullable=True)

    details = Column(String, nullable=True)

    timestamp = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )