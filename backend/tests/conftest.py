import pytest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.database import Base
from app.models.flag import Flag
from app.models.environment import Environment
from app.models.environment_override import EnvironmentOverride
from app.models.targeting_rule import TargetingRule
from app.models.user_group_membership import UserGroupMembership


TEST_DATABASE_URL = "sqlite:///./test_feature_planning.db"


engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


@pytest.fixture()
def db():

    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()

    try:
        yield session

    finally:
        session.close()

        Base.metadata.drop_all(bind=engine)