import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config.config import settings

db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)

try:
    engine = create_engine(
        db_url,
        pool_pre_ping=True,
    )
    # Test connection to ensure DB is reachable
    with engine.connect() as conn:
        pass
except Exception:
    # Fallback to local SQLite if PostgreSQL container/service is not currently running locally
    engine = create_engine(
        "sqlite:///./verity.db",
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
