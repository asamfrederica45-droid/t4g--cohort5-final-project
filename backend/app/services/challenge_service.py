from sqlalchemy.orm import Session
from app.models import Challenge
from app.schemas.challenge import ChallengeCreate, ChallengeUpdate

def create_challenge(db: Session, data: ChallengeCreate) -> Challenge:
    challenge = Challenge(**data.model_dump())
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge

def get_challenges(db: Session):
    return db.query(Challenge).all()

def get_challenge(db: Session, challenge_id: int) -> Challenge | None:
    return db.query(Challenge).filter(Challenge.id == challenge_id).first()

def update_challenge(db: Session, challenge_id: int, data: ChallengeUpdate) -> Challenge | None:
    challenge = get_challenge(db, challenge_id)
    if not challenge:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(challenge, field, value)
    db.commit()
    db.refresh(challenge)
    return challenge

def delete_challenge(db: Session, challenge_id: int) -> bool:
    challenge = get_challenge(db, challenge_id)
    if not challenge:
        return False
    db.delete(challenge)
    db.commit()
    return True