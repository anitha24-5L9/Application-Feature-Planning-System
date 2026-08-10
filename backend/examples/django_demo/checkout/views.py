from django.http import JsonResponse
import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[3]

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
from middleware.client import FeatureFlagClient


flag_client = FeatureFlagClient(
    base_url="http://127.0.0.1:8000",
    refresh_interval=30
)


def checkout_demo(request, user_id):

    flag = flag_client.refresh_flag(
        flag_key="middleware_demo_checkout",
        environment="development",
        user_id=user_id
    )

    if flag.enabled:
        return JsonResponse({
            "user": user_id,
            "feature": "middleware_demo_checkout",
            "enabled": True,
            "message": "New Checkout is enabled"
        })

    return JsonResponse({
        "user": user_id,
        "feature": "middleware_demo_checkout",
        "enabled": False,
        "message": "Using old checkout"
    })