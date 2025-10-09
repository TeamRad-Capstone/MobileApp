from pydantic import EmailStr
from sqlmodel import Session, select, update

import models
from models import End_User, EndUserCreate, Custom_Shelf, CustomShelfCreate, To_Read_Shelf, Dropped_Shelf, \
    Current_Shelf, Read_Shelf, Book, To_Read_Shelf_Book, Dropped_Shelf_Book, Read_Shelf_Book, \
    Current_Shelf_Book, Custom_Shelf_Book_Link
from security import get_password_hash

def get_user_by_email(db: Session, email: str) -> End_User | None:
    statement = select(End_User).where(End_User.email == email)
    return db.exec(statement).first()
    print(email)
    return

def create_user(db: Session, user_in: EndUserCreate) -> End_User:
    user = End_User(
        email=user_in.email,
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_custom_shelf(db: Session, owner_id: int, shelf_in: CustomShelfCreate) -> Custom_Shelf:
    custom_shelf = Custom_Shelf(end_user_id=owner_id, shelf_name=shelf_in.shelf_name)
    db.add(custom_shelf)
    db.commit()
    db.refresh(custom_shelf)
    return custom_shelf


def get_custom_shelves(db: Session, owner_id: int) -> list[Custom_Shelf]:
    statement = select(Custom_Shelf).where(Custom_Shelf.end_user_id == owner_id)
    return db.exec(statement).all()


def get_tbr_shelf(db: Session, owner_id: int) -> To_Read_Shelf:
    statement = select(To_Read_Shelf).where(To_Read_Shelf.end_user_id == owner_id)
    return db.exec(statement).first()


def get_dropped_shelf(db: Session, owner_id: int) -> Dropped_Shelf:
    statement = select(Dropped_Shelf).where(Dropped_Shelf.end_user_id == owner_id)
    return db.exec(statement).first()


def get_current_shelf(db: Session, owner_id: int) -> Current_Shelf:
    statement = select(Current_Shelf).where(Current_Shelf.end_user_id == owner_id)
    return db.exec(statement).first()


def get_read_shelf(db: Session, owner_id: int) -> Read_Shelf:
    statement = select(Read_Shelf).where(Read_Shelf.end_user_id == owner_id)
    return db.exec(statement).first()


def add_book_to_chosen_shelf(db: Session, book: Book, shelf) -> Book:
    statement = select(Book).where(Book.google_book_id == book.google_book_id)
    exists = db.exec(statement).first()

    if not exists:
        db.add(book)
        db.commit()
        db.refresh(book)
        exists = True

    # Retrieve book id after adding
    statement = select(Book.book_id).where(Book.google_book_id == book.google_book_id)
    id = db.exec(statement).first()

    match (type(shelf)):
        case models.To_Read_Shelf:
            print("This is to be added to the to read shelf")
            add_book = models.To_Read_Shelf_Book(
                to_read_shelf_id=shelf.shelf_id,
                book_id=id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)
        case models.Dropped_Shelf:
            print("This is to be added to the dropped shelf")
            add_book = models.Dropped_Shelf_Book(
                dropped_shelf_id=shelf.shelf_id,
                book_id=id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)
        case models.Current_Shelf:
            print("This is to be added to the current shelf")
            add_book = models.Current_Shelf_Book(
                current_shelf_id=shelf.shelf_id,
                book_id=id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)
        case models.Read_Shelf:
            print("This is to be added to the read shelf")
            add_book = models.Read_Shelf_Book(
                read_shelf_id=shelf.shelf_id,
                book_id=id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)
        case models.Custom_Shelf:
            print("This is to be added to the custom shelf")
            first_statement = select(Read_Shelf.shelf_id).where(Read_Shelf.end_user_id == shelf.end_user_id)
            shelf_id = db.exec(first_statement).first()
            add_book = Read_Shelf_Book(
                read_shelf_id=shelf_id,
                book_id=id
            )
            db.add(add_book)
            db.commit()
            db.refresh(add_book)

            second_statement = select(Read_Shelf_Book).where(
                Read_Shelf_Book.book_id == id and
                Read_Shelf_Book.read_shelf_id == shelf_id
            )
            bookshelf = db.exec(second_statement).first()

            third_statement = select(Custom_Shelf).where(
                Custom_Shelf.shelf_id == shelf.shelf_id and
                Custom_Shelf.shelf_name == shelf.shelf_name
            )
            custom_shelf = db.exec(third_statement).first()
            custom_shelf.shelf_books.append(bookshelf)
            db.add(custom_shelf)
            db.commit()
            db.refresh(custom_shelf)
        case _:
            print("Unknown shelf type")


def get_books(
        db: Session,
        owner_id: int,
        shelf
):
    print("I am getting the books")
    match (type(shelf)):
        case models.To_Read_Shelf:
            statement = select(To_Read_Shelf.shelf_id).where(To_Read_Shelf.end_user_id == owner_id)
            shelf_id = db.exec(statement).first()
            second_statement = select(Book).where(
                Book.book_id == To_Read_Shelf_Book.book_id and
                To_Read_Shelf_Book.to_read_shelf_id == shelf_id
            )
            return db.exec(second_statement).all()
        case models.Dropped_Shelf:
            statement = select(Dropped_Shelf.shelf_id).where(Dropped_Shelf.end_user_id == owner_id)
            shelf_id = db.exec(statement).first()
            second_statement = select(Book).where(
                Book.book_id == Dropped_Shelf_Book.book_id and
                Dropped_Shelf_Book.dropped_shelf_id == shelf_id
            )
            return db.exec(second_statement).all()
        case models.Current_Shelf:
            statement = select(Current_Shelf.shelf_id).where(Current_Shelf.end_user_id == owner_id)
            shelf_id = db.exec(statement).first()
            second_statement = select(Book).where(
                Book.book_id == Current_Shelf_Book.book_id and
                Current_Shelf_Book.current_shelf_id == shelf_id
            )
            return db.exec(second_statement).all()
        case models.Read_Shelf:
            statement = select(Read_Shelf.shelf_id).where(Read_Shelf.end_user_id == owner_id)
            shelf_id = db.exec(statement).first()
            second_statement = select(Book).where(
                Book.book_id == Read_Shelf_Book.book_id and
                Read_Shelf_Book.read_shelf_id == shelf_id
            )
            return db.exec(second_statement).all()
        case _:
            print("Unknown shelf type")
            return None


def get_custom_books(
        db: Session,
        owner_id: int,
        shelf_name
):
    statement = select(Custom_Shelf).where(
        Custom_Shelf.shelf_name == shelf_name and
        Custom_Shelf.owner_id == owner_id
    )
    custom_shelf = db.exec(statement).first()
    print("Custom Shelf is ", custom_shelf)

    second_statement = select(Custom_Shelf_Book_Link).where(
        Custom_Shelf_Book_Link.custom_shelf_id == custom_shelf.shelf_id
    )
    link = db.exec(second_statement).all()
    print("Custom Shelf Link is ", link)

    books = []
    for links in link:
        statement = select(Read_Shelf_Book).where(Read_Shelf_Book.bookshelf_id == links.bookshelf_id)
        # second_statement = select(Read_Shelf_Book).where(Read_Shelf_Book.bookshelf_id == shelf.bookshelf_id)
        book = db.exec(statement).first()
        second_statement = select(Book).where(
            Book.book_id == book.book_id and
            Read_Shelf_Book.read_shelf_id == book.shelf_id
        )
        books.append(db.exec(second_statement).first())
    return books