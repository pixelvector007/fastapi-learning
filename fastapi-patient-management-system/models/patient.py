from pydantic import BaseModel, Field, computed_field
from typing import Optional, Annotated, Literal


class Patient(BaseModel):

    id: Annotated[str, Field(..., description='ID of the Patient', examples=['P001'])]
    name: Annotated[str, Field(..., description='Name of the Patient', max_length=25)]
    city: Annotated[str, Field(..., description='City in which the Patient Lives', max_length=25)]
    age: Annotated[int, Field(..., description='Age of the Patient', gt=0, lt=120)]
    gender: Annotated[Literal['male', 'female', 'others'], Field(..., description='Gender of the patient')]
    height: Annotated[float, Field(..., description='Height of the Patient in meters', gt=0)]
    weight: Annotated[float, Field(..., description='Weight of the Patient in kgs', gt=0)]

    @computed_field
    @property
    def bmi(self) -> float:
        return round(self.weight / (self.height ** 2), 2)

    @computed_field
    @property
    def verdict(self) -> str:
        if self.bmi < 18.5:
            return 'Underweight'
        elif self.bmi < 25:
            return 'Normal'
        elif self.bmi < 30:
            return 'Overweight'
        else:
            return 'Obese'


class PatientUpdate(BaseModel):

    name: Annotated[Optional[str], Field(description='Name of the Patient', max_length=25)] = None
    city: Annotated[Optional[str], Field(description='City in which the Patient Lives', max_length=25)] = None
    age: Annotated[Optional[int], Field(description='Age of the Patient', gt=0, lt=120)] = None
    gender: Annotated[Optional[Literal['male', 'female', 'others']], Field(description='Gender of the patient')] = None
    height: Annotated[Optional[float], Field(description='Height of the Patient in meters', gt=0)] = None
    weight: Annotated[Optional[float], Field(description='Weight of the Patient in kgs', gt=0)] = None