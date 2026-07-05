from fastapi import APIRouter

from ..schemas.fraud import FraudCheckRequest, FraudCheckResponse

router = APIRouter()


@router.post("/fraud/check", response_model=FraudCheckResponse)
async def check_fraud(req: FraudCheckRequest):
    """Evaluate fraud risk for a user account."""
    # TODO: Load trained IsolationForest model and return prediction
    risk_factors: list[str] = []

    if not req.phone_verified:
        risk_factors.append("phone_not_verified")
    if not req.nid_verified:
        risk_factors.append("nid_not_verified")
    if req.email_age_days < 7:
        risk_factors.append("email_too_new")
    if req.avg_rating < 2.0 and req.total_sessions > 5:
        risk_factors.append("low_rating_with_history")

    # Heuristic probability until model is trained
    probability = min(1.0, len(risk_factors) * 0.2)

    return FraudCheckResponse(
        fraud_probability=round(probability, 4),
        is_suspicious=probability > 0.5,
        risk_factors=risk_factors,
    )
