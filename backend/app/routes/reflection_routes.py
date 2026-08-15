from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.reflection import Reflection
from app.models.user import User
from app.models.challenge import Challenge


router = APIRouter(prefix="/reflections", tags=["Reflections"])


@router.post("/challenges/{challenge_id}")
def submit_reflection(
    challenge_id: int,
    student_id: int,
    observation: str,
    improvement: str,
    db: Session = Depends(get_db)
):
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id
    ).first()

    if not challenge:
        raise HTTPException(
            status_code=404,
            detail="Challenge not found"
        )

    reflection = Reflection(
        student_id=student_id,
        challenge_id=challenge_id,
        observation=observation,
        improvement=improvement
    )

    db.add(reflection)
    db.commit()
    db.refresh(reflection)

    return {
        "message": "Reflection submitted successfully",
        "id": reflection.id
    }