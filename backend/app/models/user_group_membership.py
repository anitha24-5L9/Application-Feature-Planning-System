from sqlalchemy import Column, Integer, String
from app.database.database import Base

class UserGroupMembership(Base):
    __tablename__ = "user_group_membership"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    group_name = Column(String, nullable=False)