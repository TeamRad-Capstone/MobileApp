import os
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(bind=engine)


def get_session():
    with Session(engine) as session:
        yield session

#
# SessionLocal = sessionmaker(class_=Session, autocommit=False, autoflush=False, bind=engine)
#
# def init_db():
#     SQLModel.metadata.create_all(bind=engine)
#
# def get_session():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()