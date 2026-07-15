from sqlalchemy import Column, Integer, String
from app.database.database import Base


class UserGroupMembership(Base):
    __tablename__ = "user_group_membership"

    id = Column(Integer, primary_key=True, index=True)

    # User ID
    user_id = Column(String, nullable=False)

    # Group Name
    group_name = Column(String, nullable=False)