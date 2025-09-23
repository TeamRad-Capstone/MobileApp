from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session
import models, crud, security, database

app = FastAPI()
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

@app.post("/register/", response_model=models.EndUserRead)
def register(user_in: models.EndUserCreate, db: Session = Depends(database.get_session)):
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

@app.post("/shelf/", response_model=models.Custom_Shelf)
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