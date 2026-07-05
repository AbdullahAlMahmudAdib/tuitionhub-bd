from contextlib import asynccontextmanager

import redis.asyncio as redis
from fastapi import FastAPI

from .routers import health, predict, fraud

redis_client: redis.Redis | None = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global redis_client
    redis_client = redis.from_url("redis://redis:6379/1", decode_responses=True)
    yield
    if redis_client:
        await redis_client.aclose()


app = FastAPI(
    title="TuitionHub AI Service",
    version="0.1.0",
    description="Salary prediction & fraud detection for TuitionHub BD",
    lifespan=lifespan,
)

app.include_router(health.router)
app.include_router(predict.router, prefix="/api/v1")
app.include_router(fraud.router, prefix="/api/v1")
