from sqlalchemy.orm import Session

from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException

from app.models.user import User
from app.security import (
    hash_password,
    verify_password,
    SECRET_KEY,
    ALGORITHM
)

from app.database.database import get_db



# ==========================
# Get User By Email
# ==========================

def get_user_by_email(
    db: Session,
    email: str
):

    return db.query(User).filter(
        User.email == email
    ).first()



# ==========================
# Create User
# ==========================

def create_user(
    db: Session,
    name: str,
    email: str,
    password: str
):

    hashed_password = hash_password(password)

    user = User(
        name=name,
        email=email,
        hashed_password=hashed_password,
        role="admin"
    )

    db.add(user)

    db.commit()

    db.refresh(user)

    return user



# ==========================
# Authenticate User
# ==========================

def authenticate_user(
    db: Session,
    email: str,
    password: str
):

    user = get_user_by_email(
        db,
        email
    )


    if not user:
        return None


    if not verify_password(
        password,
        user.hashed_password
    ):
        return None


    return user



# ==========================
# JWT Authentication
# ==========================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)



def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials"
    )


    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )


        email: str = payload.get("sub")


        if email is None:
            raise credentials_exception


    except JWTError:

        raise credentials_exception



    user = db.query(User).filter(
        User.email == email
    ).first()


    if user is None:
        raise credentials_exception


    return user