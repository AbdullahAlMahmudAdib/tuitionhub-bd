from pydantic import BaseModel


class FraudCheckRequest(BaseModel):
    user_id: str
    email_age_days: int
    phone_verified: bool
    nid_verified: bool
    avg_rating: float
    total_sessions: int
    login_frequency_per_week: float
    device_count: int


class FraudCheckResponse(BaseModel):
    fraud_probability: float
    is_suspicious: bool
    risk_factors: list[str]
