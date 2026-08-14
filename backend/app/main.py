from fastapi import FastAPI
from app.database import engine, Base
from app.models import  User
from app.routes import subject_routes, lesson_routes, challenge_routes,user_routes
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Fredu Spark API",
    description="Transforming classroom theory into hands-on learning.",
)


origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allowed origins
    allow_credentials=True,           # Allow cookies/auth headers
    allow_methods=["*"],               # Allow all HTTP methods
    allow_headers=["*"],               # Allow all headers
)

app.include_router(subject_routes.router)
app.include_router(lesson_routes.router)
app.include_router(challenge_routes.router)
app.include_router(user_routes.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Fredu Spark API. Visit /docs to try it out."}