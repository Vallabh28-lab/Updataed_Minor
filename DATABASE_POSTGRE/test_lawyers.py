from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://postgres:vallabh@localhost:5432/lawyerdb"

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    result = conn.execute(text("SELECT * FROM lawyers"))

    for row in result:
        print(dict(row._mapping))