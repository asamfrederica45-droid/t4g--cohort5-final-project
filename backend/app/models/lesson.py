from sqlalchemy import Column, Integer, String,Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    learning_objective = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=True) 
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)


    subject = relationship("Subject", back_populates="lessons")
    challenges = relationship("Challenge", back_populates="lesson", cascade="all, delete-orphan")