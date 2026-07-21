import sqlite3

conn = sqlite3.connect("feature_planning.db")
cursor = conn.cursor()

try:
    cursor.execute("""
        ALTER TABLE flags
        ADD COLUMN rollout_percentage INTEGER DEFAULT 0
    """)
    print("Column added successfully.")
except sqlite3.OperationalError as e:
    print(e)

conn.commit()
conn.close()