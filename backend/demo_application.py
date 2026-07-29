import time

from middleware.client import FeatureFlagClient


client = FeatureFlagClient(
    "http://127.0.0.1:8000",
    refresh_interval=15
)

# Load the flag for the first time
client.refresh_flag(
    flag_key="login",
    environment="development",
    user_id="user1"
)

# Start background refresh
client.start()

print("Demo Application Started...\n")

for i in range(5):

    login_flag = client.get_flag("login")

    if login_flag and login_flag.enabled:
        print(f"[{i+1}] Login Feature : ENABLED")
    else:
        print(f"[{i+1}] Login Feature : DISABLED")

    time.sleep(5)

client.stop()

print("\nDemo Finished")