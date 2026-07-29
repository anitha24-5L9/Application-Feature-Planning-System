import requests
import threading
import time

from .cache import FlagCache
from .models import FlagState


class FeatureFlagClient:

    def __init__(self, base_url, refresh_interval=30):
        self.base_url = base_url.rstrip("/")
        self.cache = FlagCache()

        self.refresh_interval = refresh_interval

        self._tracked_flags = []

        self._running = False
        self._thread = None

    def refresh_flag(
        self,
        flag_key,
        environment="development",
        user_id="anonymous"
    ):
        payload = {
            "flag_key": flag_key,
            "environment": environment,
            "user_context": {
                "user_id": user_id
            }
        }

        response = requests.post(
            f"{self.base_url}/evaluate/",
            json=payload,
            timeout=5
        )

        response.raise_for_status()

        data = response.json()

        flag = FlagState(
            key=flag_key,
            enabled=data.get("enabled", False),
            reason=data.get("reason", ""),
            environment=data.get("environment", "")
        )

        self.cache.set_flag(flag)

        track = (flag_key, environment, user_id)
        if track not in self._tracked_flags:
            self._tracked_flags.append(track)

        return flag

    def get_flag(self, flag_key):
        return self.cache.get_flag(flag_key)

    def _refresh_loop(self):
        while self._running:

            for flag_key, environment, user_id in self._tracked_flags:
                try:
                    self.refresh_flag(
                        flag_key,
                        environment,
                        user_id
                    )
                except Exception as e:
                    print(f"Refresh failed for {flag_key}: {e}")

            time.sleep(self.refresh_interval)

    def start(self):
        if self._running:
            return

        self._running = True

        self._thread = threading.Thread(
            target=self._refresh_loop,
            daemon=True
        )

        self._thread.start()

        print("Middleware refresh started.")

    def stop(self):
        self._running = False

        if self._thread:
            self._thread.join()

        print("Middleware refresh stopped.")