from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class FlagVersion(Base):
    __tablename__ = "flag_versions"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String, nullable=False)

    flag_id = Column(Integer, ForeignKey("flags.id"))

    flag = relationship("Flag")