from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.lesson import LessonCreate, LessonUpdate, LessonOut
from app.services import lesson_service as service

router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.post("/", response_model=LessonOut, status_code=201)
def create_lesson(data: LessonCreate, db: Session = Depends(get_db)):
    return service.create_lesson(db, data)

@router.get("/", response_model=list[LessonOut])
def list_lessons(db: Session = Depends(get_db)):
    return service.get_lessons(db)


@router.get("/{lesson_id}", response_model=LessonOut)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = service.get_lesson(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@router.put("/{lesson_id}", response_model=LessonOut)
def update_lesson(lesson_id: int, data: LessonUpdate, db: Session = Depends(get_db)):
    lesson = service.update_lesson(db, lesson_id, data)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@router.delete("/{lesson_id}")
def delete_lesson(lesson_id: int, db: Session = Depends(get_db)):
    deleted = service.delete_lesson(db, lesson_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"message": "Lesson deleted"}