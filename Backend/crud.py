""" This module contains the CRUD performed on the database"""

from sqlmodel import Session, select
import models
from security import get_password_hash


def get_user_by_email(db: Session, email: str) -> models.EndUser | None:
    """This function returns the EndUser based on the email & Session email passed in"""
    statement = select(models.EndUser).where(models.EndUser.email == email)
    return db.exec(statement).first()


def create_user(db: Session, user_in: models.EndUserCreate) -> models.EndUser:
    """This function creates a new EndUser and adds it to the Session. It returns an
     EndUser object
     """
    user = models.EndUser(
        email=user_in.email, username=user_in.username,
        password_hash=get_password_hash(user_in.password),)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_custom_shelf(db: Session, owner_id: int, shelf_in: models.CustomShelfBase) -> models.CustomShelf:
    """This function creates a new CustomShelf and adds it to the Session."""
    custom_shelf = models.CustomShelf(end_user_id=owner_id, shelf_name=shelf_in.shelf_name)
    db.add(custom_shelf)
    db.commit()
    db.refresh(custom_shelf)
    return custom_shelf


def get_custom_shelves(db: Session, owner_id: int) -> list[models.CustomShelf]:
    """This function returns a list of CustomShelf objects based on the end user id"""
    statement = select(models.CustomShelf).where(models.CustomShelf.end_user_id == owner_id)
    return db.exec(statement).all()


def get_shelf(db:Session, owner_id: int, shelf):
    """This function returns a Shelf object based on the end user id and model passed in"""
    match (type(shelf)):
        case models.ToReadShelf:
            statement = select(models.ToReadShelf).where(
                models.ToReadShelf.end_user_id == owner_id)
        case models.DroppedShelf:
            statement = select(models.DroppedShelf).where(
                models.DroppedShelf.end_user_id == owner_id)
        case models.CurrentShelf:
            statement = select(models.CurrentShelf).where(
                models.CurrentShelf.end_user_id == owner_id)
        case models.ReadShelf:
            statement = select(models.ReadShelf).where(
                models.ReadShelf.end_user_id == owner_id)
    return db.exec(statement).first()


def add_book_to_chosen_shelf(db: Session, book: models.Book, shelf):
    """This function adds a book to the chosen shelf based on the shelf type passed in"""
    statement = select(models.Book).where(models.Book.google_book_id == book.google_book_id)
    exists = db.exec(statement).first()

    if not exists:
        db.add(book)
        db.commit()
        db.refresh(book)
        exists = True

    statement = select(models.Book.book_id).where(models.Book.google_book_id == book.google_book_id)
    book_id = db.exec(statement).first()

    # Match case that does the adding to the db based on shelf type passed in
    match (type(shelf)):
        case models.ToReadShelf:
            print("This is to be added to the to read shelf")
            add_book = models.ToReadShelfBook(
                to_read_shelf_id=shelf.shelf_id,
                book_id=book_id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)
        case models.DroppedShelf:
            print("This is to be added to the dropped shelf")
            add_book = models.DroppedShelfBook(
                dropped_shelf_id=shelf.shelf_id,
                book_id=book_id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)
        case models.CurrentShelf:
            print("This is to be added to the current shelf")
            add_book = models.CurrentShelfBook(
                current_shelf_id=shelf.shelf_id,
                book_id=book_id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)
        case models.ReadShelf:
            print("This is to be added to the read shelf")
            add_book = models.ReadShelfBook(
                read_shelf_id=shelf.shelf_id,
                book_id=book_id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)
        case models.CustomShelf:
            print("This is to be added to the custom shelf")
            first_statement = select(models.ReadShelf.shelf_id).where(
                models.ReadShelf.end_user_id == shelf.end_user_id
            )
            shelf_id = db.exec(first_statement).first()

            # Checks to see if book already exists in the read shelf book prior to adding
            # to the custom shelf
            second_statement = select(models.ReadShelfBook).where(
                models.ReadShelfBook.book_id == book_id and
                models.ReadShelfBook.read_shelf_id == shelf_id
            )
            book_in_read_shelf = db.exec(second_statement).first()
            if not book_in_read_shelf:
                add_book = models.ReadShelfBook(
                    read_shelf_id=shelf_id,
                    book_id=id
                )
                db.add(add_book)
                db.commit()
                db.refresh(add_book)

            third_statement = select(models.CustomShelf).where(
                models.CustomShelf.shelf_id == shelf.shelf_id and
                models.CustomShelf.shelf_name == shelf.shelf_name
            )
            custom_shelf = db.exec(third_statement).first()
            custom_shelf.shelf_books.append(book_in_read_shelf)
            db.add(custom_shelf)
            db.commit()
            db.refresh(custom_shelf)
        case _:
            print("Unknown shelf type")


def get_books(db: Session, owner_id: int, shelf):
    """This function returns a list of books based on the shelf type passed in and related
    to end user
    """
    print("I am getting the books")

    match (type(shelf)):
        case models.ToReadShelf:
            shelf_type = models.ToReadShelf
            linking_type = models.ToReadShelfBook
            linked_by = models.ToReadShelfBook.to_read_shelf_id
        case models.DroppedShelf:
            shelf_type = models.DroppedShelf
            linking_type = models.DroppedShelfBook
            linked_by = models.DroppedShelfBook.dropped_shelf_id
        case models.CurrentShelf:
            shelf_type = models.CurrentShelf
            linking_type = models.CurrentShelfBook
            linked_by = models.CurrentShelfBook.current_shelf_id
        case models.ReadShelf:
            shelf_type = models.ReadShelf
            linking_type = models.ReadShelfBook
            linked_by = models.ReadShelfBook.read_shelf_id
        case _:
            print("Unknown shelf type")
            return
    statement = select(shelf_type.shelf_id).where(shelf_type.end_user_id == owner_id)
    shelf_id = db.exec(statement).first()
    second_statement = select(models.Book).where(
        models.Book.book_id == linking_type.book_id and
        linked_by == shelf_id)
    return db.exec(second_statement).all()


def get_custom_books(db: Session, owner_id: int, shelf_name):
    """This function gets a list of books based on the custom shelf name and end user
    attached
    """
    statement = select(models.CustomShelf).where(
        models.CustomShelf.shelf_name == shelf_name and
        models.CustomShelf.owner_id == owner_id
    )
    custom_shelf = db.exec(statement).first()
    print("Custom Shelf is ", custom_shelf)

    second_statement = select(models.CustomShelfBookLink).where(
        models.CustomShelfBookLink.custom_shelf_id == custom_shelf.shelf_id
    )
    link = db.exec(second_statement).all()
    print("Custom Shelf Link is ", link)

    books = []
    for links in link:
        statement = select(models.ReadShelfBook).where(
            models.ReadShelfBook.bookshelf_id == links.bookshelf_id
        )
        book = db.exec(statement).first()
        second_statement = select(models.Book).where(
            models.Book.book_id == book.book_id and
            models.ReadShelfBook.read_shelf_id == book.shelf_id
        )
        books.append(db.exec(second_statement).first())
    return books
