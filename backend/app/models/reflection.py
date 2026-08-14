from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, index=True)
    challenge_id = Column(Integer, ForeignKey("challenges.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    observation = Column(String(500), nullable=False)
    improvement = Column(String(500), nullable=False)

    challenge = relationship("Challenge")
    student = relationship("User")