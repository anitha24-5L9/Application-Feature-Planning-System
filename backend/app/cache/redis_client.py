import json
import redis


redis_client = redis.Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True
)


def check_redis_connection():
    try:
        redis_client.ping()
        print("✅ Redis connected successfully.")
    except redis.ConnectionError:
        print("❌ Redis connection failed.")


# -----------------------------
# Cache Helper Functions
# -----------------------------

CACHE_TTL = 300  # 5 minutes


def get_cache(key: str):
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return None


def set_cache(key: str, value):
    redis_client.set(
        key,
        json.dumps(value),
        ex=CACHE_TTL
    )

def delete_cache(key: str):
    redis_client.delete(key)


def clear_flag_cache(flag_key: str):
    """
    Delete all cache entries related to a feature flag.
    """
    pattern = f"{flag_key}:*"

    for key in redis_client.scan_iter(pattern):
        redis_client.delete(key)