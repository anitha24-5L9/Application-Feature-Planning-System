from datetime import datetime

from app.cache.redis_client import redis_client


class AnalyticsService:
    """
    Stores evaluation counts in Redis.

    Key format:

    analytics:{flag_key}:{YYYY-MM-DD}:{HH}
    """

    PREFIX = "analytics"

    @classmethod
    def build_key(cls, flag_key: str):
        now = datetime.utcnow()

        date = now.strftime("%Y-%m-%d")
        hour = now.strftime("%H")

        return f"{cls.PREFIX}:{flag_key}:{date}:{hour}"

    @classmethod
    def record_evaluation(cls, flag_key: str):
        key = cls.build_key(flag_key)

        redis_client.incr(key)

        # keep analytics for 30 days
        redis_client.expire(key, 60 * 60 * 24 * 30)

    @classmethod
    def get_all_counters(cls):
        """
        Returns all analytics counters stored in Redis.
        """
        result = {}

        for key in redis_client.scan_iter(f"{cls.PREFIX}:*"):
            key_str = key.decode() if isinstance(key, bytes) else key
            value = redis_client.get(key)

            if isinstance(value, bytes):
                value = value.decode()

            result[key_str] = int(value)

        return result

    @classmethod
    def get_flag_counters(cls, flag_key: str):
        """
        Returns analytics for a single flag.
        """
        result = {}

        pattern = f"{cls.PREFIX}:{flag_key}:*"

        for key in redis_client.scan_iter(pattern):
            key_str = key.decode() if isinstance(key, bytes) else key
            value = redis_client.get(key)

            if isinstance(value, bytes):
                value = value.decode()

            result[key_str] = int(value)

        return result