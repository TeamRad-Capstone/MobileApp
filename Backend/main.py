from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session
from starlette.middleware.cors import CORSMiddleware

import models, crud, security, database

app = FastAPI()
origins = [
    "*"
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.on_event("startup")
def on_startup():
    database.init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to Rad Reads"}


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(database.get_session),
) -> models.End_User:
    email = security.decode_access_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/register", response_model=models.EndUserRead)
def register(
    user_in: models.EndUserCreate, 
    db: Session = Depends(database.get_session)
):
    if crud.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, user_in)
    return user


@app.post("/login", response_model=models.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_session),
):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = security.create_access_token(user.email)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/users/me", response_model=models.EndUserRead)
def read_users_me(current_user: models.End_User = Depends(get_current_user)):
    return current_user


@app.post("/shelf/")
def create_shelf(
    shelf_in: models.CustomShelfCreate,
    current_user: models.End_User = Depends(get_current_user),
    db: Session = Depends(database.get_session),
):
    return crud.create_custom_shelf(db, current_user.end_user_id, shelf_in)


@app.get("/shelves/me")
def read_shelves(
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user)
):
    shelves = crud.get_custom_shelves(db, current_user.end_user_id)
    return [shelf for shelf in shelves]


@app.get("/defaultShelves/me")
def read_all_default_shelves(
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    shelves = [crud.get_tbr_shelf(db, current_user.end_user_id),
               crud.get_dropped_shelf(db, current_user.end_user_id),
               crud.get_current_shelf(db, current_user.end_user_id),
               crud.get_read_shelf(db, current_user.end_user_id)]
    return shelves


@app.post("/shelves/tbr")
def add_book_to_tbr_shelf(
        book_in: models.Book,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user)
):
    # Get the user's TBR shelf
    shelf = crud.get_tbr_shelf(db, current_user.end_user_id)
    print("BOOK ID ADDING: ", book_in.google_book_id)
    return crud.add_book_to_chosen_shelf(db, book_in, models.To_Read_Shelf(), shelf.shelf_id)


@app.post("/shelves/dropped")
def add_book_to_dropped_shelf(
        book_in: models.Book,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user)
):
    shelf = crud.get_dropped_shelf(db, current_user.end_user_id)
    return crud.add_book_to_chosen_shelf(db, book_in, models.Dropped_Shelf(), shelf.shelf_id)


@app.post("/shelves/current")
def add_book_to_current_shelf(
        book_in: models.Book,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user)
):
    shelf = crud.get_current_shelf(db, current_user.end_user_id)
    print("TEST THE THING TO ADD TO CURRENT SHELF: ", shelf.shelf_id)
    return crud.book_to_chosen_shelf(db, book_in, models.Current_Shelf(), shelf.shelf_id)


@app.post("/shelves/read")
def add_book_to_read_shelf(
        book_in: models.Book,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user)
):
    # Get the user's TBR shelf
    shelf = crud.get_read_shelf(db, current_user.end_user_id)
    return crud.add_book_to_chosen_shelf(db, book_in, models.Read_Shelf(), shelf.shelf_id)


@app.post("/shelves/custom/{shelf_name}")
def add_book_to_custom_shelf(
        shelf_name: str,
        book_in: models.Book,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    # Get the user's TBR shelf
    shelves = crud.get_custom_shelves(db, current_user.end_user_id)
    for shelf in shelves:
        print("THIS IS THE SHELF NAME", shelf.shelf_name)
        print("THIS IS THE SHELF NAME TO MATCH", shelf_name)
        if shelf.shelf_name.strip() == shelf_name.strip():
            print("SHELF HAS BEEN MATCHED")
            return crud.add_book_to_chosen_shelf(db, book_in, models.Custom_Shelf(), shelf.shelf_id)

    raise HTTPException(status_code=404, detail="Custom shelf not found")


@app.get("/shelves/tbr")
def get_books_from_current_shelf(
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.get_books(db, current_user.end_user_id, models.To_Read_Shelf())


@app.get("/shelves/dropped")
def get_books_from_dropped_shelf(
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.get_books(db, current_user.end_user_id, models.Dropped_Shelf())

@app.get("/shelves/read")
def get_books_from_current_shelf(
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.get_books(db, current_user.end_user_id, models.Read_Shelf())


@app.get("/shelves/custom/{name}")
def get_books_from_current_shelf(
        name: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),

):
    return crud.get_custom_books(db, current_user.end_user_id, name.strip())


@app.get("/shelves/current")
def get_books_from_current_shelf(
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.get_books(db, current_user.end_user_id, models.Current_Shelf())


# PROMPT: can you make fastapi endpoints for reading goals so i can create, view, update, and delete them for the logged-in user? i also want endpoints for all goals, active goals, and completed goals, using my sqlmodel models readinggoalcreate, readinggoalupdate, and readinggoalread
@app.post("/goals/", response_model=models.ReadingGoalRead)
def create_goal(goal_in: models.ReadingGoalCreate, db: Session = Depends(database.get_session),
                current_user: models.End_User = Depends(get_current_user)):
    return crud.create_reading_goal(db, current_user.end_user_id, goal_in)


@app.get("/goals/me", response_model=list[models.ReadingGoalRead])
def get_my_goals(db: Session = Depends(database.get_session),
                 current_user: models.End_User = Depends(get_current_user)):
    return crud.get_reading_goals(db, current_user.end_user_id)


@app.get("/goals/active", response_model=list[models.ReadingGoalRead])
def get_active_goals(db: Session = Depends(database.get_session),
                     current_user: models.End_User = Depends(get_current_user)):
    return crud.get_active_goals(db, current_user.end_user_id)


@app.get("/goals/completed", response_model=list[models.ReadingGoalRead])
def get_completed_goals(db: Session = Depends(database.get_session),
                        current_user: models.End_User = Depends(get_current_user)):
    return crud.get_completed_goals(db, current_user.end_user_id)


@app.put("/goals/{goal_id}", response_model=models.ReadingGoalRead)
def update_goal(goal_id: int, goal_in: models.ReadingGoalUpdate, db: Session = Depends(database.get_session),
                current_user: models.End_User = Depends(get_current_user)):
    return crud.update_reading_goal(db, current_user.end_user_id, goal_id, goal_in)


@app.delete("/goals/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(database.get_session),
                current_user: models.End_User = Depends(get_current_user)):
    return crud.delete_reading_goal(db, current_user.end_user_id, goal_id)


@app.put("/shelves/custom/{shelf_name}/{new_shelf_name}")
def update_shelf(
        shelf_name: str,
        new_shelf_name: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.update_custom_shelf_name(db, current_user.end_user_id, shelf_name, new_shelf_name)


@app.delete("/shelves/custom/{shelf_name}")
def delete_custom_shelf(
        shelf_name: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    print("I AM TRYING TO DELETE A CUSTOM SHELF (delete on an id)")

    return crud.delete_custom_shelf(db, current_user.end_user_id, shelf_name)


@app.get("/shelves/upcoming/{google_book_id}")
def get_upcoming_of_book(
        google_book_id: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.get_upcoming_value(db, current_user.end_user_id, google_book_id)


@app.post("/shelves/upcoming/{google_book_id}")
def add_upcoming_of_book(
        google_book_id: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.add_upcoming_value(db, current_user.end_user_id, google_book_id)


@app.get("/username/me")
def read_username(current_user: models.End_User = Depends(get_current_user)):
    return current_user.username


@app.get("/shelves/upcomingBooks")
def retrieve_upcoming_books(
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user)
):
    return crud.get_upcoming_books(db, current_user.end_user_id)


@app.delete("/shelves/tbr/{shelf_name}/{google_book_id}")
def delete_book_from_shelf(
        shelf_name: str,
        google_book_id: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.delete_book(db, current_user.end_user_id, models.To_Read_Shelf(), shelf_name, google_book_id)


@app.delete("/shelves/dropped/{shelf_name}/{google_book_id}")
def delete_book_from_shelf(
        shelf_name: str,
        google_book_id: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.delete_book(db, current_user.end_user_id, models.Dropped_Shelf(), shelf_name, google_book_id)

@app.delete("/shelves/current/{shelf_name}/{google_book_id}")
def delete_book_from_shelf(
        shelf_name: str,
        google_book_id: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.delete_book(db, current_user.end_user_id, models.Current_Shelf(), shelf_name, google_book_id)


@app.delete("/shelves/read/{shelf_name}/{google_book_id}")
def delete_book_from_shelf(
        shelf_name: str,
        google_book_id: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.delete_book(db, current_user.end_user_id, models.Read_Shelf(), shelf_name, google_book_id)


@app.delete("/shelves/custom/{shelf_name}/{google_book_id}")
def delete_book_from_shelf(
        shelf_name: str,
        google_book_id: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.delete_book(db, current_user.end_user_id, models.Custom_Shelf(), shelf_name, google_book_id)

@app.post("/reading_goal_book/")
def add_reading_goal_book(
    reading_goal_id: int,
    book_id: int,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    new_link = models.Reading_Goal_Book(
        reading_goal_id=reading_goal_id,
        book_id=book_id
    )
    db.add(new_link)
    db.commit()
    db.refresh(new_link)
    return new_link

@app.get("/books", response_model=list[models.Book])
def get_all_books(db: Session = Depends(database.get_session),
                  current_user: models.End_User = Depends(get_current_user)):
    return crud.get_all_books(db)

@app.delete("/reading_goal_book/{reading_goal_id}/{book_id}")
def remove_book_from_goal(
    reading_goal_id: int,
    book_id: int,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user),
):
    deleted = (
        db.query(models.Reading_Goal_Book)
        .filter(
            models.Reading_Goal_Book.reading_goal_id == reading_goal_id,
            models.Reading_Goal_Book.book_id == book_id
        )
        .delete(synchronize_session=False)
    )
    db.commit()
    if not deleted:
        raise HTTPException(status_code=404, detail="Book not found in goal")
    return {"message": "Book removed from goal"}

@app.get("/reading_goal_book/{reading_goal_id}", response_model=list[models.Book])
def get_books_from_goal(
    reading_goal_id: int,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user),
):
    books = (
        db.query(models.Book)
        .join(models.Reading_Goal_Book, models.Book.book_id == models.Reading_Goal_Book.book_id)
        .filter(models.Reading_Goal_Book.reading_goal_id == reading_goal_id)
        .all()
    )

    if not books:
        raise HTTPException(status_code=404, detail="No books found for this goal")
    return books

@app.put("/books/{book_id}/rating")
def update_book_rating(
    book_id: int,
    rating: int,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user),
):
    updated_book = crud.update_read_shelf_book_rating(db, current_user.end_user_id, book_id, rating)
    return {"book_id": updated_book.book_id, "rating": updated_book.rating}


@app.put("/shelves/upcoming/{google_book_id}")
def remove_upcoming_book(
        google_book_id: str,
        db: Session = Depends(database.get_session),
        current_user: models.End_User = Depends(get_current_user),
):
    return crud.delete_upcoming_value(db, current_user.end_user_id, google_book_id)


@app.get("/shelves/rating/{google_book_id}")
def get_rating_of_book(
        google_book_id: str,
        current_user: models.End_User = Depends(get_current_user),
        db: Session = Depends(database.get_session),
):
    return crud.get_book_rating(db, current_user.end_user_id, google_book_id)


@app.post("/logs/{book_id}", response_model=models.LogRead)
def create_log(
    book_id: int,
    log_in: models.LogCreate,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    return crud.create_log(db, book_id, log_in)


@app.get("/logs/me", response_model=list[models.LogRead])
def get_my_logs(
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    return crud.get_user_logs(db, current_user.end_user_id)


@app.get("/logs/book/{book_id}", response_model=list[models.LogRead])
def get_logs_for_book(
    book_id: int,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    logs = crud.get_logs_by_book(db, book_id)
    if not logs:
        raise HTTPException(status_code=404, detail="No logs found for this book")
    return logs


@app.put("/logs/{log_id}", response_model=models.LogRead)
def update_log_endpoint(
    log_id: int,
    log_in: models.LogUpdate,
    db: Session = Depends(database.get_session)
):
    updated_log = crud.update_log(db, log_id, log_in)
    if not updated_log:
        raise HTTPException(status_code=404, detail="Log not found")
    return updated_log


@app.delete("/logs/{log_id}")
def delete_log_endpoint(
    log_id: int,
    db: Session = Depends(database.get_session)
):
    crud.delete_log(db, log_id)
    return {"message": "Log deleted successfully"}


@app.put("/username/me/{new_username}")
def update_username(
    new_username: str,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    return crud.update_username(db, current_user.end_user_id, new_username)

@app.put("/password/me")
def update_password(
    password_update: models.PasswordUpdate,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    return crud.update_password(db, current_user.end_user_id, password_update)


@app.get("/image/me")
def get_profile_image(
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    return crud.get_profile_image(db, current_user.end_user_id)


@app.put("/image/me/{image_key}")
def update_profile_image(
    image_key: str,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    return crud.update_profile_image(db, current_user.end_user_id, image_key)


@app.delete("/user/me")
def delete_account(
    user: models.EndUserLogin,
    db: Session = Depends(database.get_session),
    current_user: models.End_User = Depends(get_current_user)
):
    print("Received user:", user)
    return crud.delete_account(db, current_user, current_user.end_user_id, user)