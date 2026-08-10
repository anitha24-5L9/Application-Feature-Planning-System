from datetime import datetime

from sqlalchemy.orm import Session

from app.cache.redis_client import redis_client
from app.models.evaluation_analytics import EvaluationAnalytics


class AnalyticsSyncService:

    PREFIX = "analytics:*"

    @classmethod
    def sync(cls, db: Session):

        keys = redis_client.keys(cls.PREFIX)

        inserted = 0
        updated = 0

        for raw_key in keys:

            key = (
                raw_key.decode()
                if isinstance(raw_key, bytes)
                else raw_key
            )

            parts = key.split(":")

            # Expected:
            # analytics:{flag_key}:{date}:{hour}
            if len(parts) != 4:
                continue

            _, flag_key, date_str, hour = parts

            value = redis_client.get(raw_key)

            if value is None:
                continue

            count = int(value)

            date_value = datetime.strptime(
                date_str,
                "%Y-%m-%d"
            ).date()

            hour_value = int(hour)

            # Check whether this analytics record
            # already exists in SQLite
            analytics = (
                db.query(EvaluationAnalytics)
                .filter(
                    EvaluationAnalytics.flag_key == flag_key,
                    EvaluationAnalytics.date == date_value,
                    EvaluationAnalytics.hour == hour_value
                )
                .first()
            )

            if analytics:

                analytics.evaluation_count = count
                updated += 1

            else:

                analytics = EvaluationAnalytics(
                    flag_key=flag_key,
                    date=date_value,
                    hour=hour_value,
                    evaluation_count=count
                )

                db.add(analytics)

                inserted += 1

        db.commit()

        return {
            "records_inserted": inserted,
            "records_updated": updated
        }