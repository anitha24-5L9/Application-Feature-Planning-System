from typing import Dict
from .models import FlagState


class FlagCache:
    def __init__(self):
        self._flags: Dict[str, FlagState] = {}

    def set_flag(self, flag: FlagState):
        self._flags[flag.key] = flag

    def get_flag(self, key: str):
        return self._flags.get(key)

    def clear(self):
        self._flags.clear()

    def all_flags(self):
        return self._flags