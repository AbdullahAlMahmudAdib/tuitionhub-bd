from fastapi import APIRouter

from ..schemas.predict import SalaryPredictRequest, SalaryPredictResponse

router = APIRouter()


@router.post("/predict/salary", response_model=SalaryPredictResponse)
async def predict_salary(req: SalaryPredictRequest):
    """Predict monthly tuition fee based on subject, location, and tutor profile."""
    # TODO: Train and load LinearRegression model from Redis/production-versioned pickle
    # Return sensible default based on market heuristics until model is trained
    base_rate: float = 3000.0
    level_multiplier: float = 1.0 + 0.15 * req.tutor_qualification_level
    hour_multiplier: float = req.weekly_hours / 4.0
    estimated = base_rate * level_multiplier * hour_multiplier

    return SalaryPredictResponse(
        predicted_salary_bdt=round(estimated, 2),
        confidence_interval=(round(estimated * 0.85, 2), round(estimated * 1.15, 2)),
    )
