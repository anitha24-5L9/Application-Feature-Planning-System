from app.database.database import engine
from app.models.targeting_rule import TargetingRule

print("Dropping targeting_rules table (if it exists)...")
TargetingRule.__table__.drop(bind=engine, checkfirst=True)

print("Creating targeting_rules table...")
TargetingRule.__table__.create(bind=engine)

print("✅ targeting_rules table recreated successfully.")