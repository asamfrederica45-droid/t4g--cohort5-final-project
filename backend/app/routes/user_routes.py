from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/signup")
def signup(
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        full_name=full_name,
        email=email,
        password=password,
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Student registered successfully",
        "id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "role": new_user.role
    }


@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == email,
        User.role == role
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email, password, or role"
        )

    if user.password != password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email, password, or role"
        )

    return {
        "message": "Login successful",
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role
    }


@router.get("/students")
def get_students(db: Session = Depends(get_db)):
    students = db.query(User).filter(User.role == "student").all()

    return [
        {
            "id": student.id,
            "full_name": student.full_name,
            "email": student.email,
            "role": student.role
        }
        for student in students
    ]


@router.get("/students/{student_id}")
def get_student(
    student_id: int,
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

    return {
        "id": student.id,
        "full_name": student.full_name,
        "email": student.email,
        "role": student.role
    }


@router.put("/students/{student_id}")
def update_student(
    student_id: int,
    full_name: str = Form(...),
    email: str = Form(...),
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

    existing_email = db.query(User).filter(
        User.email == email,
        User.id != student_id
    ).first()

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    student.full_name = full_name
    student.email = email

    db.commit()
    db.refresh(student)

    return {
        "message": "Student updated successfully",
        "id": student.id,
        "full_name": student.full_name,
        "email": student.email,
        "role": student.role
    }



@router.delete("/students/{student_id}")
def delete_student(
    student_id: int,
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

    db.delete(student)
    db.commit()

    return {
        "message": "Student deleted successfully"
    }
