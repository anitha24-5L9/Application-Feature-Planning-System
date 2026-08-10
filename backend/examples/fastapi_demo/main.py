from fastapi import FastAPI

from middleware.client import FeatureFlagClient
app = FastAPI(
    title="Feature Flag FastAPI Integration Demo",
    version="1.0.0"
)

# Connect to the main Feature Flag Management System
flag_client = FeatureFlagClient(
    base_url="http://127.0.0.1:8000",
    refresh_interval=30
)


@app.on_event("startup")
def startup_event():
    flag_client.start()


@app.on_event("shutdown")
def shutdown_event():
    flag_client.stop()


@app.get("/")
def home():
    return {
        "message": "FastAPI Feature Flag Integration Demo"
    }


@app.get("/demo/checkout/{user_id}")
def checkout_demo(user_id: str):

    flag = flag_client.refresh_flag(
        flag_key="middleware_demo_checkout",
        environment="development",
        user_id=user_id
    )

    if flag.enabled:
        return {
            "user": user_id,
            "feature": "middleware_demo_checkout",
            "enabled": True,
            "message": "New Checkout is enabled"
        }

    return {
        "user": user_id,
        "feature": "middleware_demo_checkout",
        "enabled": False,
        "message": "Using old checkout"
    }