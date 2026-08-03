from sqlalchemy import Column, Integer, String, Date
from app.database.database import Base


class EvaluationAnalytics(Base):
    __tablename__ = "evaluation_analytics"

    id = Column(Integer, primary_key=True, index=True)

    flag_key = Column(String, index=True)

    date = Column(Date, index=True)

    hour = Column(Integer)

    evaluation_count = Column(Integer, default=0)