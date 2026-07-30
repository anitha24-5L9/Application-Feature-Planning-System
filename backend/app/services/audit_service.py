import json

from app.models.audit_log import AuditLog


def create_audit_log(
    db,
    action,
    actor,
    flag_key,
    environment,
    before,
    after
):
    log = AuditLog(
        action=action,
        performed_by=actor,
        flag_key=flag_key,
        details=json.dumps(
            {
                "environment": environment,
                "before": before,
                "after": after
            },
            indent=4,
            default=str
        )
    )

    db.add(log)
    db.commit()


def get_all_logs(db):
    return (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .all()
    )