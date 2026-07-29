import time

from middleware.client import FeatureFlagClient


client = FeatureFlagClient(
    "http://127.0.0.1:8000",
    refresh_interval=10
)

client.refresh_flag(
    flag_key="login",
    environment="development",
    user_id="user1"
)

client.start()

for i in range(3):

    flag = client.get_flag("login")

    print(f"\nCheck {i+1}")

    print(flag)

    time.sleep(10)

client.stop()