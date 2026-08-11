from sqlalchemy.orm import Session
from app.models import Lesson
from app.schemas.lesson import LessonCreate, LessonUpdate

def create_lesson(db: Session, data: LessonCreate) -> Lesson:
    lesson = Lesson(**data.model_dump())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson

def get_lessons(db: Session):
    return db.query(Lesson).all()


def get_lesson(db: Session, lesson_id: int) -> Lesson | None:
    return db.query(Lesson).filter(Lesson.id == lesson_id).first()

def update_lesson(db: Session, lesson_id: int, data: LessonUpdate) -> Lesson | None:
    lesson = get_lesson(db, lesson_id)
    if not lesson:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(lesson, field, value)
    db.commit()
    db.refresh(lesson)
    return lesson

def delete_lesson(db: Session, lesson_id: int) -> bool:
    lesson = get_lesson(db, lesson_id)
    if not lesson:
        return False
    db.delete(lesson)
    db.commit()
    return True