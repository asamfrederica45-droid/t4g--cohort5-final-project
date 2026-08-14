from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.database import Base


class ChallengeProgress(Base):
    __tablename__ = "challenge_progress"

    id = Column(Integer, primary_key=True, autoincrement=True)

    student_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    challenge_id = Column(
        Integer,
        ForeignKey("challenges.id"),
        nullable=False
    )

    completed = Column(Boolean, default=False, nullable=False)