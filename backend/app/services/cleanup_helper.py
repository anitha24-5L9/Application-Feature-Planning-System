from datetime import datetime


def update_cleanup_status(flag):
    """
    Maintain cleanup lifecycle fields automatically.

    Cleanup candidate when:
    - rollout_percentage == 100
    - OR flag is disabled
    """

    completed = (
        flag.rollout_percentage == 100
        or not flag.enabled
    )

    if completed:
        # Set timestamp only when entering cleanup state
        if flag.cleanup_status_since is None:
            flag.cleanup_status_since = datetime.utcnow()

    else:
        # Flag became active again
        flag.cleanup_status_since = None
        flag.cleanup_reviewed = False