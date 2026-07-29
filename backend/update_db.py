import sqlite3

conn = sqlite3.connect("feature_planning.db")
cursor = conn.cursor()


def add_column(table_name, column_name, column_definition):
    cursor.execute(f"PRAGMA table_info({table_name})")
    columns = [row[1] for row in cursor.fetchall()]

    if column_name not in columns:
        cursor.execute(
            f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_definition}"
        )
        print(f"Added '{column_name}' to '{table_name}'")
    else:
        print(f"'{column_name}' already exists in '{table_name}'")


# Existing migration
add_column("flags", "rollout_percentage", "INTEGER DEFAULT 0")

# Day 14 Audit Log migration
add_column("audit_log", "flag_key", "TEXT")
add_column("audit_log", "details", "TEXT")
add_column("audit_log", "timestamp", "DATETIME")

conn.commit()
conn.close()

print("\nDatabase migration completed successfully.")