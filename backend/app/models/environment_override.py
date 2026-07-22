from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.database.database import Base


class EnvironmentOverride(Base):
    __tablename__ = "environment_overrides"

    id = Column(Integer, primary_key=True, index=True)

    flag_id = Column(
        Integer,
        ForeignKey("flags.id"),
        nullable=False
    )

    environment_id = Column(
        Integer,
        ForeignKey("environments.id"),
        nullable=False
    )

    override_value = Column(
        Boolean,
        nullable=False
    )