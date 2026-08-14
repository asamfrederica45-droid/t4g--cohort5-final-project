from pydantic import BaseModel,ConfigDict,field_validator
from typing import Optional,List,Union


class ChallengeBase(BaseModel):
    title: str
    instructions: Union[str, List[str]]
    materials_needed: Optional[Union[str, List[str]]] = None
    real_life_application: Optional[str] = None
    reflection_questions: Optional[Union[str, List[str]]] = None
    difficulty_level: Optional[str] = None
    lesson_id: int
    @field_validator("instructions", "materials_needed", "reflection_questions")
    @classmethod
    def list_to_text(cls, value):
        if isinstance(value, list):
            return "\n".join(value)
        return value
class ChallengeCreate(ChallengeBase):
    pass


class ChallengeUpdate(BaseModel):
    title: Optional[str] = None
    instructions: Optional[Union[str, List[str]]] = None
    materials_needed: Optional[Union[str, List[str]]] = None
    real_life_application: Optional[str] = None
    reflection_questions: Optional[Union[str, List[str]]] = None
    difficulty_level: Optional[str] = None
    lesson_id: Optional[int] = None

    @field_validator("instructions", "materials_needed", "reflection_questions")
    @classmethod
    def list_to_text(cls, value):
        if isinstance(value, list):
            return "\n".join(value)
        return value
class ChallengeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    instructions: str
    materials_needed: Optional[str] = None
    real_life_application: Optional[str] = None
    reflection_questions: Optional[str] = None
    difficulty_level: Optional[str] = None
    duration_minutes: Optional[int] = None 
    lesson_id: int

        