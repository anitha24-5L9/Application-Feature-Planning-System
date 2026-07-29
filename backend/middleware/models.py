from dataclasses import dataclass


@dataclass
class FlagState:
    key: str
    enabled: bool
    reason: str = ""
    environment: str = ""