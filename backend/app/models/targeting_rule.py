from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class TargetingRule(Base):
    __tablename__ = "targeting_rules"

    id = Column(Integer, primary_key=True, index=True)

    # Feature Flag
    flag_id = Column(Integer, ForeignKey("flags.id"), nullable=False)

    # Whitelisted User ID
    user_id = Column(String, nullable=False)

    flag = relationship("Flag")