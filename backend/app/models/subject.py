from sqlalchemy import Column, Integer, String,Text
from sqlalchemy.orm import relationship
from app.database import Base
class Subject(Base): 
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    lessons = relationship("Lesson", back_populates="subject", cascade="all, delete-orphan")
    