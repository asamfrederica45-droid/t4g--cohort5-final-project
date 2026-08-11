from sqlalchemy.orm import Session
from app.models import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate

def create_subject(db: Session, data: SubjectCreate) -> Subject:
    subject = Subject(**data.model_dump())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject 

def get_subjects(db: Session):
    return db.query(Subject).all()

def get_subject(db: Session, subject_id: int) -> Subject | None:
    return db.query(Subject).filter(Subject.id == subject_id).first()

def update_subject(db: Session, subject_id: int, data: SubjectUpdate) -> Subject | None:
    subject = get_subject(db, subject_id)
    if not subject:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(subject, field, value)
    db.commit()
    db.refresh(subject)
    return subject

def delete_subject(db: Session, subject_id: int) -> bool:
    subject = get_subject(db, subject_id)
    if not subject:
        return False
    db.delete(subject)
    db.commit()
    return True