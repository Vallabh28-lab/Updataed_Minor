from sqlalchemy import create_engine

DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"

engine = create_engine(DATABASE_URL)

try:
    conn = engine.connect()
    print("Database Connected Successfully!")
    conn.close()
except Exception as e:
    print(e)