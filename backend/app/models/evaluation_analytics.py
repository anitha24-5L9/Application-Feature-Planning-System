from sqlalchemy import Column, Integer, String, Date
from app.database.database import Base


class EvaluationAnalytics(Base):
    __tablename__ = "evaluation_analytics"

    id = Column(Integer, primary_key=True, index=True)

    flag_key = Column(String, index=True, nullable=False)

    date = Column(Date, index=True, nullable=False)

    hour = Column(Integer, nullable=False)

    evaluation_count = Column(Integer, default=0, nullable=False)