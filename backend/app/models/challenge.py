from sqlalchemy import Column, Integer, String,Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Challenge(Base):
    __tablename__ = "challenges"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    instructions = Column(Text, nullable=True)
    materials_needed = Column(Text, nullable=True)
    real_life_application = Column(Text, nullable=True)
    reflection_questions = Column(Text, nullable=True)
    difficulty_level = Column(String(20), nullable=False)
    duration_minutes = Column(Integer, nullable=True)

    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    lesson = relationship("Lesson", back_populates="challenges")
