from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.challenge_progress import ChallengeProgress
from app.models.challenge import Challenge
from app.models.user import User


router = APIRouter(prefix="/progress", tags=["Progress"])


@router.post("/challenges/{challenge_id}/complete")
def complete_challenge(
    challenge_id: int,
    student_id: int,
    db: Session = Depends(get_db)
):
    # Check that the student exists
    student = db.query(User).filter(
        User.id == student_id,
        User.role == "student"
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Check that the challenge exists
    challenge = db.query(Challenge).filter(
        Challenge.id == challenge_id
    ).first()

    if not challenge:
        raise HTTPException(
            status_code=404,
            detail="Challenge not found"
        )

    # Check whether this student already completed the challenge
    progress = db.query(ChallengeProgress).filter(
        ChallengeProgress.student_id == student_id,
        ChallengeProgress.challenge_id == challenge_id
    ).first()

    if progress:
        progress.completed = True
    else:
        progress = ChallengeProgress(
            student_id=student_id,
            challenge_id=challenge_id,
            completed=True
        )

        db.add(progress)

    db.commit()
    db.refresh(progress)

    return {
        "message": "Challenge completed successfully",
        "student_id": student_id,
        "challenge_id": challenge_id,
        "completed": progress.completed
    }