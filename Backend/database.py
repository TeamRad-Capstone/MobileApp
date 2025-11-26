"""This module contains database configuration"""
import os
import models
from sqlmodel import Session, SQLModel, create_engine, select
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
# DATABASE_URL = os.getenv("HEROKU_POSTGRESQL_MAUVE_URL")

# Store reference to urls for default images
DEFAULT_IMAGE_URLS = [
    "beach_book",
    "blue_vibes",
    "brain_book",
    "cloud_book",
    "hijab_book",
    "man",
    "test_tube_book",
]

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    """This function initializes the database"""
    SQLModel.metadata.create_all(bind=engine)


def get_session():
    """This function is used to create a sqlmodel session"""
    with Session(engine) as session:
        existing = session.exec(select(models.Image_Url)).first()
        if existing is None:
            images = [models.Image_Url(url=url) for url in DEFAULT_IMAGE_URLS]
            session.add_all(images)
            session.commit()
        yield session
