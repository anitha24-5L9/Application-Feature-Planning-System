from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.flag import Flag


class CleanupService:

    @staticmethod
    def get_cleanup_candidates(db: Session, days: int = 30):

        cutoff = datetime.utcnow() - timedelta(days=days)

        flags = db.query(Flag).all()

        candidates = []

        for flag in flags:

            completed = (
                flag.rollout_percentage == 100
                or not flag.enabled
            )

            if not completed:
                continue

            if flag.cleanup_status_since is None:
                continue

            if flag.cleanup_status_since > cutoff:
                continue

            days_stale = (
                datetime.utcnow() -
                flag.cleanup_status_since
            ).days

            candidates.append({
                "key": flag.key,
                "owner_team": flag.owner_team,
                "enabled": flag.enabled,
                "rollout_percentage": flag.rollout_percentage,
                "days_stale": days_stale,
                "reviewed": flag.cleanup_reviewed
            })

        return candidates

    @staticmethod
    def mark_reviewed(db: Session, flag_key: str):

        flag = (
            db.query(Flag)
            .filter(Flag.key == flag_key)
            .first()
        )

        if flag is None:
            return None

        flag.cleanup_reviewed = True

        db.commit()

        db.refresh(flag)

        return flag