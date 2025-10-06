from pydantic import EmailStr
from sqlmodel import Session, select
from models import End_User, EndUserCreate, Custom_Shelf, CustomShelfCreate, To_Read_Shelf, Dropped_Shelf, \
    Current_Shelf, Read_Shelf, Book, To_Read_Shelf_Book, Dropped_Shelf_Book
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

def add_book_to_shelf(db: Session, owner_id: int, book: Book) -> Book:
    statement = select(Book).where(Book.google_book_id == book.google_book_id)
    result = db.exec(statement).first()

    if not result:
        db.add(book)
        db.commit()
        db.refresh(book)
    else:
        print("This book already exists")


def add_book_to_tbr_shelf(db: Session, book: Book, shelf: To_Read_Shelf) -> Book: #, shelf: To_Read_Shelf) -> Book:
    statement = select(Book).where(Book.google_book_id == book.google_book_id)
    exists = db.exec(statement).first()

    if not exists:
        db.add(book)
        db.commit()
        db.refresh(book)
        statement = select(Book.book_id).where(Book.google_book_id == book.google_book_id)
        id = db.exec(statement).first()
        print("This book does not exist: ", id)
        tbr_book = To_Read_Shelf_Book(
            to_read_shelf_id=shelf.shelf_id,
            book_id=id
        )
        db.add(tbr_book)
        db.commit()
        db.refresh(tbr_book)
    else:
        print("This book already exists")
        statement = select(Book.book_id).where(Book.google_book_id == book.google_book_id)
        id = db.exec(statement).first()
        print("This book does exist: ", id)
        tbr_book = To_Read_Shelf_Book(
            to_read_shelf_id=shelf.shelf_id,
            book_id=id
        )
        db.add(tbr_book)
        db.commit()
        db.refresh(tbr_book)

    return book


def add_book_to_dropped_shelf(db: Session, book: Book, shelf: Dropped_Shelf) -> Book:
    statement = select(Book).where(Book.google_book_id == book.google_book_id)
    exists = db.exec(statement).first()

    if not exists:
        db.add(book)
        db.commit()
        db.refresh(book)
        statement = select(Book.book_id).where(Book.google_book_id == book.google_book_id)
        id = db.exec(statement).first()
        print("This book does not exist: ", id)
        tbr_book = Dropped_Shelf_Book(
            dropped_shelf_id=shelf.shelf_id,
            book_id=id
        )
        db.add(tbr_book)
        db.commit()
        db.refresh(tbr_book)
    else:
        print("This book already exists")
        statement = select(Book.book_id).where(Book.google_book_id == book.google_book_id)
        id = db.exec(statement).first()
        print("This book does exist: ", id)
        tbr_book = Dropped_Shelf_Book(
            dropped_shelf_id=shelf.shelf_id,
            book_id=id
        )
        db.add(tbr_book)
        db.commit()
        db.refresh(tbr_book)

    return book