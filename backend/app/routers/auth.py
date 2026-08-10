from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from fastapi.security import (
    OAuth2PasswordRequestForm
)

from sqlalchemy.orm import Session

from sqlalchemy import text

from app.database.database import (
    get_db,
    DATABASE_TYPE,
    DATABASE_NAME
)

from app.schemas.auth import (
    UserRegister,
    Token,
    UserResponse,
    ChangePasswordRequest,
    SystemStatusResponse
)

from app.services.auth import (
    get_user_by_email,
    create_user,
    authenticate_user,
    get_current_user,
    change_user_password
)

from app.security import (
    create_access_token
)

from app.models.user import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# Current User
# ==========================================

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(
        get_current_user
    )
):

    return current_user


# ==========================================
# Register
# ==========================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):

    existing_user = get_user_by_email(
        db,
        user.email
    )

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = create_user(
        db,
        user.name,
        user.email,
        user.password
    )

    return new_user


# ==========================================
# Login
# ==========================================

@router.post(
    "/login",
    response_model=Token
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        db,
        form_data.username,
        form_data.password
    )

    if not user:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "sub": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ==========================================
# Change Password
# ==========================================

@router.put(
    "/change-password"
)
def change_password(
    password_data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    change_user_password(
        db=db,
        user=current_user,
        current_password=(
            password_data.current_password
        ),
        new_password=(
            password_data.new_password
        )
    )

    return {
        "message": "Password changed successfully"
    }


# ==========================================
# Backend / Database Status
# ==========================================

@router.get(
    "/status",
    response_model=SystemStatusResponse
)
def system_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    )
):

    try:

        db.execute(
            text("SELECT 1")
        )

        database_status = "Connected"

    except Exception:

        database_status = "Disconnected"

    return {
        "backend": "Active",
        "database": database_status,
        "database_type": DATABASE_TYPE,
        "database_name": DATABASE_NAME
    }