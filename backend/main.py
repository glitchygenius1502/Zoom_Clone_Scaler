from datetime import UTC, datetime
from secrets import choice
from string import ascii_letters, digits

from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import models
import schemas
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, get_db
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Video Conferencing Backend")


origins = [
    "http://localhost:3000",      # Your local Next.js dev server
    "http://127.0.0.1:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins temporarily
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




MEETING_ID_LENGTH = 10
MEETING_ID_ALPHABET = ascii_letters + digits


def generate_meeting_id(db: Session) -> str:
    while True:
        meeting_id = "".join(choice(MEETING_ID_ALPHABET) for _ in range(MEETING_ID_LENGTH))
        existing_meeting = (
            db.query(models.Meeting)
            .filter(models.Meeting.meeting_id == meeting_id)
            .first()
        )
        if existing_meeting is None:
            return meeting_id


def get_user_or_404(db: Session, user_id: int) -> models.User:
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@app.post(
    "/users/",
    response_model=schemas.UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_user(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db),
) -> models.User:
    user = models.User(name=user_data.name, email=str(user_data.email))
    db.add(user)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists",
        ) from exc

    db.refresh(user)
    return user


@app.post(
    "/meetings/instant/",
    response_model=schemas.MeetingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_instant_meeting(
    meeting_data: schemas.MeetingInstantCreate,
    db: Session = Depends(get_db),
) -> models.Meeting:
    get_user_or_404(db, meeting_data.host_id)

    meeting = models.Meeting(
        meeting_id=generate_meeting_id(db),
        title=meeting_data.title,
        description=meeting_data.description,
        start_time=datetime.now(UTC).replace(tzinfo=None),
        duration=meeting_data.duration,
        is_scheduled=False,
        host_id=meeting_data.host_id,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@app.post(
    "/meetings/schedule/",
    response_model=schemas.MeetingResponse,
    status_code=status.HTTP_201_CREATED,
)
def schedule_meeting(
    meeting_data: schemas.MeetingScheduledCreate,
    db: Session = Depends(get_db),
) -> models.Meeting:
    get_user_or_404(db, meeting_data.host_id)

    meeting = models.Meeting(
        meeting_id=generate_meeting_id(db),
        title=meeting_data.title,
        description=meeting_data.description,
        start_time=meeting_data.start_time,
        duration=meeting_data.duration,
        is_scheduled=True,
        host_id=meeting_data.host_id,
    )
    db.add(meeting)
    db.commit()
    db.refresh(meeting)
    return meeting


@app.get("/meetings/{meeting_id}", response_model=schemas.MeetingResponse)
def get_meeting(
    meeting_id: str,
    db: Session = Depends(get_db),
) -> models.Meeting:
    meeting = (
        db.query(models.Meeting)
        .filter(models.Meeting.meeting_id == meeting_id)
        .first()
    )
    if meeting is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Meeting not found",
        )
    return meeting


@app.get(
    "/users/{user_id}/meetings",
    response_model=list[schemas.MeetingResponse],
)
def get_user_meetings(
    user_id: int,
    db: Session = Depends(get_db),
) -> list[models.Meeting]:
    get_user_or_404(db, user_id)
    return (
        db.query(models.Meeting)
        .filter(models.Meeting.host_id == user_id)
        .order_by(models.Meeting.start_time.desc())
        .all()
    )
