from pydantic import BaseModel


class SalaryPredictRequest(BaseModel):
    subject: str
    location: str
    student_class: str
    weekly_hours: int
    tutor_experience_years: float
    tutor_qualification_level: int  # 1=HSC, 2=Bachelor, 3=Masters, 4=PhD


class SalaryPredictResponse(BaseModel):
    predicted_salary_bdt: float
    confidence_interval: tuple[float, float]
    currency: str = "BDT"
