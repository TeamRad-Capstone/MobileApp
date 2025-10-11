"""This module is for declaring the models structure"""
from typing import Optional, List
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship, Column, ARRAY, String, UniqueConstraint

END_USER_ID = "enduser.end_user_id"
BOOK_ID = "book.book_id"

class Token(SQLModel):
    """This class is used to represent a Token object which takes an SQLModel
    (representing a table as in an SQL database) and represents the data.
    """
    access_token: str
    token_type: str


class ImageUrl(SQLModel, table=True):
    """This class is used to represent an ImageUrl object in which there exists
    a matching table in the database.
    """
    image_url_id: int | None = Field(default=None, primary_key=True)
    url: str


class GoalLabel(Enum):
    """This class is used to represent a GoalLabel enumerator"""
    COMPLETE = 'Completed'
    INCOMPLETE = 'Ongoing'


class GoalStatus(SQLModel, table=True):
    """This class is used to represent a GoalStatus object in which there exists
    a matching table in the database."""
    goal_status_id: int | None = Field(default=None, primary_key=True)
    label: GoalLabel = Field(GoalLabel.INCOMPLETE)


class TransferHistory(SQLModel, table=True):
    """This class is used to represent an TransferHistory object in which there exists
    a matching table in the database."""
    transfer_history_id: int | None = Field(default=None, primary_key=True)


class EndUserBase(SQLModel):
    """This class is used to represent an EndUserBase object using the table format from an
    SQL databases.
    """
    username: str
    email: str = Field(index=True, unique=True)


class EndUser(EndUserBase, table=True):
    """This class is used to represent an EndUser object using the table format inherited
    from EndUserBase class and expanding on it to represent the data in the matching database
    table
     """
    end_user_id: int | None = Field(default=None, primary_key=True)
    image_url_id: int | None = Field(default=None, foreign_key="imageurl.image_url_id")
    transfer_history_id: int | None = Field(default=None,
                                            foreign_key="transferhistory.transfer_history_id"
                                            )
    password_hash: str
    created_at: datetime =Field(default=datetime.now())


class EndUserCreate(EndUserBase):
    """This class is used to represent an EndUserCreate object using the table format inherited
    from EndUserBase class and expanding on it to include extra data"""
    password: str

class EndUserRead(EndUserBase):
    """This class is used to represent an EndUserRead object using the table format inherited
    from EndUserBase class and expanding on it to include extra data"""
    end_user_id: int

#
# class EndUserLogin(SQLModel):
#     """This class is used to represent an EndUserLogin object using the table format"""
#     email: EmailStr
#     password: str


class ReadingGoal(SQLModel, table=True):
    """This class is used to represent a ReadingGoal object using the table format and representing
    the data in the matching database table
    """
    reading_goal_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key=END_USER_ID)
    goal_status_id: int | None = Field(default=None, foreign_key="goalstatus.goal_status_id")
    goal_name: str
    description: str


class Recommendation(SQLModel, table=True):
    """This class is used to represent a Recommendation object using the table format
    and representing the data in the matching database table
    """
    recommendation_id: int | None = Field(default=None,
                                          primary_key=True
                                          )
    end_user_id: int | None = Field(default=None,
                                    foreign_key=END_USER_ID)


class CustomShelfBase(SQLModel):
    """This class is used to represent a CustomShelfBase object using the table format"""
    shelf_name: str


class CustomShelfBookLink(SQLModel, table=True):
    """This class is used to represent a CustomShelfBookLink object using the table format
     and representing the data in the matching database table
    """
    custom_shelf_id: Optional[int] = Field(default=None, foreign_key="customshelf.shelf_id",
                                           primary_key=True)
    bookshelf_id: Optional[int] = Field(default=None, foreign_key="readshelfbook.bookshelf_id",
                                        primary_key=True)


class CustomShelf(CustomShelfBase, table=True):
    """This class is used to represent a CustomShelf object using the table format and representing
    the data in the matching database table
    """
    shelf_id: Optional[int] = Field(default=None, primary_key=True)
    end_user_id: Optional[int] = Field(default=None, foreign_key=END_USER_ID)
    shelf_books: List["ReadShelfBook"] = Relationship(back_populates="custom_shelves",
                                                        link_model=CustomShelfBookLink)


class CustomShelfUpdate(CustomShelfBase):
    """This class is used to represent a CustomShelfUpdate object using the table format inherited
    from CustomShelfBase class and expanding on it to include extra data
    """
    shelf_name: Optional[str] = None


class ToReadShelf(SQLModel, table=True):
    """This class is used to represent a ToReadShelf object using the table format and representing
    the data in the matching database table
    """
    shelf_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key=END_USER_ID)
    shelf_name: str = Field(default="Want to Read")


class DroppedShelf(SQLModel, table=True):
    """This class is used to represent a DroppedShelf object using the table format and representing
    the data in the matching database table
    """
    shelf_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key=END_USER_ID)
    shelf_name: str = Field(default="Dropped")


class CurrentShelf(SQLModel, table=True):
    """This class is used to represent a CurrentShelf object using the table format and representing
    the data in the matching database table
    """
    shelf_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key=END_USER_ID)
    shelf_name: str = Field(default="Currently Reading")


class ReadShelf(SQLModel, table=True):
    """This class is used to represent a ReadShelf object using the table format and representing
    the data in the matching database table
    """
    shelf_id: int | None = Field(default=None, primary_key=True)
    end_user_id: int | None = Field(default=None, foreign_key=END_USER_ID)
    shelf_name: str = Field(default="Read")


class Book(SQLModel, table=True):
    """This class is used to represent a Book object using the table format and representing
    the data in the matching database table
    """
    book_id: Optional[int] = Field(default=None, primary_key=True)
    google_book_id: str = Field(unique=True)
    title: str
    authors: List[str] | None = Field(sa_column=Column(ARRAY(String)), default_factory=list)
    description: str
    number_of_pages: int
    categories: List[str] | None = Field(sa_column=Column(ARRAY(String)), default_factory=list)
    published_date: str | None


class ReadShelfBook(SQLModel, table=True):
    """This class is used to represent a ReadShelfBook object using the table format and
    representing the data in the matching database table
    """
    bookshelf_id: int | None = Field(default=None, primary_key=True)
    read_shelf_id: int | None = Field(default=None, foreign_key="readshelf.shelf_id")
    custom_shelves: List["CustomShelf"] = Relationship(
        back_populates="shelf_books",
        link_model=CustomShelfBookLink
    )
    book_id: int | None = Field(default=None, foreign_key=BOOK_ID)
    reading_goal_id: int | None = Field(default=None, foreign_key="readinggoal.reading_goal_id")
    date_read: datetime
    rating: float | None
    __table_args__ = (UniqueConstraint("book_id", "read_shelf_id", name="unique_read_shelf_book"),)


class ToReadShelfBook(SQLModel, table=True):
    """This class is used to represent a ToReadShelfBook object using the table format
    and representing the data in the matching database table
    """
    bookshelf_id: int | None = Field(default=None, primary_key=True)
    to_read_shelf_id: int | None = Field(default=None, foreign_key="toreadshelf.shelf_id")
    book_id: int | None = Field(default=None, foreign_key=BOOK_ID)
    upcoming_book_value: int | None
    __table_args__ = (UniqueConstraint("book_id", "to_read_shelf_id",
                                       name="unique_to_read_shelf_book"),)


class DroppedShelfBook(SQLModel, table=True):
    """This class is used to represent a DroppedShelfBook object using the table format
    and representing the data in the matching database table
    """
    bookshelf_id: int | None = Field(default=None, primary_key=True)
    dropped_shelf_id: int = Field(default=None, foreign_key="droppedshelf.shelf_id")
    book_id: int | None = Field(default=None, foreign_key=BOOK_ID)
    __table_args__ = (UniqueConstraint("book_id", "dropped_shelf_id",
                                       name="unique_dropped_shelf_book"),)


class CurrentShelfBook(SQLModel, table=True):
    """This class is used to represent a CurrentShelfBook object using the table format
    and representing the data in the matching database table
    """
    bookshelf_id: int | None = Field(default=None, primary_key=True)
    current_shelf_id: int = Field(default=None, foreign_key="currentshelf.shelf_id")
    book_id: int | None = Field(default=None, foreign_key=BOOK_ID)
    __table_args__ = (UniqueConstraint("book_id", "current_shelf_id",
                                       name="unique_current_shelf_book"),)


class ImportedBook(SQLModel, table=True):
    """This class is used to represent an ImportedBook object using the table format
    and representing the data in the matching database table
    """
    imported_book_id: int | None = Field(default=None, primary_key=True)
    book_id: int | None = Field(default=None, foreign_key=BOOK_ID, unique=True)
    transfer_history_id: int | None = Field(default=None, foreign_key="transferhistory."
                                                                      "transfer_history_id")
    review: str
    date_read: datetime
    original_shelf: str


class JournalEntry(SQLModel, table=True):
    """This class is used to represent a JournalEntry object using the table format
    and representing the data in the matching database table
    """
    journal_entry_id: int | None = Field(default=None, primary_key=True)
    book_id: int | None = Field(default=None, foreign_key=BOOK_ID)
    end_user_id: int | None = Field(default=None, foreign_key=END_USER_ID)


class LogSection(SQLModel, table=True):
    """This class is used to represent a LogSection object using the table format
    and representing the data in the matching database table"""
    log_section_id: int | None = Field(default=None, primary_key=True)
    journal_entry_id: int | None = Field(default=None, foreign_key="journalentry.journal_entry_id")
    section_name: str
    entry_text: str
    original_date: datetime
    edited_date: datetime
