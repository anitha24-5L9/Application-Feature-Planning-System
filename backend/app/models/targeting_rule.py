from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class TargetingRule(Base):
    __tablename__ = "targeting_rules"

    id = Column(Integer, primary_key=True, index=True)

    # Feature Flag
    flag_id = Column(Integer, ForeignKey("flags.id"), nullable=False)

    # User Target
    user_id = Column(String, nullable=True)

    # Group Target
    group_name = Column(String, nullable=True)

    flag = relationship("Flag")