from app.database import engine, Base, SessionLocal
from app.models import Subject,Lesson,Challenge

Base.metadata.create_all(bind=engine)
db = SessionLocal()

try:
    science = Subject(name="Science")
    description = "Science is the study of the natural world through observation and experimentation."
    db.add(science)
    db.commit()
    db.refresh(science)

    photosynthesis = Lesson(
        title="Photosynthesis",
        description="Learn about the process by which plants convert sunlight into energy.",
        learning_objective="Understand the process of photosynthesis and its importance to life on Earth.",
        subject_id=science.id
    )
    db.add(photosynthesis)
    db.commit()
    db.refresh(photosynthesis)

    bean_experiment = Challenge(
        title="Bean Growth Experiment",
        instructions="Plant a bean seed in soil and observe its growth over a week.",
        materials_needed="Bean seeds, soil, pot, water, sunlight.",
        real_life_application="Understanding plant growth and the importance of sunlight and water.",
        reflection_questions="What did you observe about the growth of the bean?",
        difficulty_level="Easy",
        lesson_id=photosynthesis.id
    )

    db.add(bean_experiment)
    db.commit()

    print("Successful execution of seed.py: Data inserted into the database.")
except Exception as e:
    db.rollback()
    print(f"Error occurred during execution of seed.py: {e}")
finally:
    db.close()
        