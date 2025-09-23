from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import EmailStr
from datetime import datetime

class Token(SQLModel):
    access_token: str
    token_type: str


class Image_Url(SQLModel, table=True):
    image_url_id: int | None = Field(default=None, primary_key=True)
    url: str

class Goal_Status(SQLModel, table=True):
    goal_status_id: int | None = Field(default=None, primary_key=True)
    label: str


class Transfer_History(SQLModel, table=True):
    transfer_history_id: int | None = Field(default=None, primary_key=True)


class EndUserBase(SQLModel):
    username: str
    email: str = Field(index=True, unique=True)


class End_User(EndUserBase, table=True):
    end_user_id: int | None = Field(default=None, primary_key=True)
    image_url_id: int | None = Field(default=None, foreign_key="image_url.image_url_id")
    transfer_history_id: int | None = Field(default=None, foreign_key="transfer_history.transfer_history_id")
    password_hash: str
    created_at: datetime =Field(default=datetime.now())


class EndUserCreate(EndUserBase):
    password: str

class EndUserRead(EndUserBase):
    end_user_id: int

    class Config:
        from_attributes = True


class EndUserLogin(SQLModel):
    email: EmailStr
    password: str


class Reading_Goal(SQLModel, table=True):
    reading_goal_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key="end_user.end_user_id")
    goal_status_id: int | None = Field(default=None, foreign_key="goal_status.goal_status_id")
    goal_name: str
    description: str


class Recommendation(SQLModel, table=True):
    recommendation_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key="end_user.end_user_id")


class CustomShelfBase(SQLModel):
    shelf_name: str


class Custom_Shelf(CustomShelfBase, table=True):
    shelf_id: Optional[int] = Field(default=None, primary_key=True)
    end_user_id: Optional[int] = Field(default=None, foreign_key="end_user.end_user_id")

class CustomShelfCreate(CustomShelfBase):
    pass

class CustomShelfRead(Custom_Shelf):
    shelf_id: int

    class Config:
        from_attributes = True


class CustomShelfUpdate(CustomShelfBase):
    shelf_name: Optional[str] = None


class To_Read_Shelf(SQLModel, table=True):
    shelf_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key="end_user.end_user_id")
    shelf_name: str = Field(default="Want to Read")


class Dropped_Shelf(SQLModel, table=True):
    shelf_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key="end_user.end_user_id")
    shelf_name: str = Field(default="Dropped")


class Current_Shelf(SQLModel, table=True):
    shelf_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key="end_user.end_user_id")
    shelf_name: str = Field(default="Currently Reading")


class Read_Shelf(SQLModel, table=True):
    shelf_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key="end_user.end_user_id")
    shelf_name: str = Field(default="Read")


class Upcoming_Books(SQLModel, table=True):
    upcoming_book_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key="end_user.end_user_id")


class Book(SQLModel, table=True):
    book_id: int | None = Field(default=None, primary_key=True)
    google_book_id: int
    title: str
    author: str | None
    description: str
    number_of_pages: int
    category: str
    published_date: str
    date_read: datetime
    rating: float


class Imported_Book(SQLModel, table=True):
    imported_book_id: int | None = Field(default=None, primary_key=True)
    transfer_history_id: int | None = Field(default=None, foreign_key="transfer_history.transfer_history_id")
    review: str
    date_read: datetime
    original_shelf: str


class Journal_Entry(SQLModel, table=True):
    journal_entry_id: int | None = Field(default=None, primary_key=True)
    book_id: int | None = Field(default=None, foreign_key="book.book_id")
    end_user_id: int | None = Field(default=None, foreign_key="end_user.end_user_id")


class Log_Section(SQLModel, table=True):
    log_section_id: int | None = Field(default=None, primary_key=True)
    journal_entry_id: int | None = Field(default=None, primary_key=True)
    section_name: str
    entry_text: str
    original_date: datetime
    edited_date: datetime