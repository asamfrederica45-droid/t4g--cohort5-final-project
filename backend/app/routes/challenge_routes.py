from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.challenge import ChallengeCreate, ChallengeUpdate, ChallengeOut
from app.services import challenge_service as service

router = APIRouter(prefix="/challenges", tags=["Challenges"])


@router.post("/", response_model=ChallengeOut, status_code=201)
def create_challenge(data: ChallengeCreate, db: Session = Depends(get_db)):
    return service.create_challenge(db, data)

@router.get("/", response_model=list[ChallengeOut])
def list_challenges(db: Session = Depends(get_db)):
    return service.get_challenges(db)


@router.get("/{challenge_id}", response_model=ChallengeOut)
def get_challenge(challenge_id: int, db: Session = Depends(get_db)):
    challenge = service.get_challenge(db, challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge


@router.put("/{challenge_id}", response_model=ChallengeOut)
def update_challenge(challenge_id: int, data: ChallengeUpdate, db: Session = Depends(get_db)):
    challenge = service.update_challenge(db, challenge_id, data)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge


@router.delete("/{challenge_id}")
def delete_challenge(challenge_id: int, db: Session = Depends(get_db)):
    deleted = service.delete_challenge(db, challenge_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return {"message": "Challenge deleted"}