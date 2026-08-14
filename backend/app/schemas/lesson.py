from pydantic import BaseModel,ConfigDict
from typing import Optional

class LessonBase(BaseModel):
    title :str
    description : Optional[str] = None
    learning_objective : Optional[str]= None
    duration_minutes : Optional[int] = None
    subject_id: int

class LessonCreate(LessonBase):
    pass

class LessonUpdate(BaseModel):
    title : Optional[str] = None
    description :Optional[str] = None
    learning_objective : Optional[str] = None 
    duration_minutes : Optional[int] = None
    subject_id : Optional[int] = None

class LessonOut(LessonBase):
    model_config =  ConfigDict(from_attributes=True)
    id:int