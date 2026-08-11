from app.database import engine, Base
from app.models.subject import Subject
from app.models.lesson import Lesson
from app.models.challenge import Challenge

Base.metadata.create_all(bind=engine)

print("All tables created successfully")