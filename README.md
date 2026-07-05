# TuitionHub BD

A nationwide tuition marketplace for Bangladesh connecting university students seeking tuition jobs with guardians looking for qualified private tutors.

## Tech Stack

- **Frontend:** Next.js 15 + Tailwind CSS v4 + Motion
- **Backend:** ASP.NET Core 9 Web API (Clean Architecture + CQRS)
- **AI Service:** FastAPI + scikit-learn
- **Database:** PostgreSQL 16
- **Cache:** Redis 7
- **Real-Time:** SignalR
- **Container:** Docker

## Project Structure

```
TuitionHub-BD/
├── frontend/          # Next.js 15
├── backend/           # ASP.NET Core 9
├── ai-service/        # FastAPI
├── database/          # Scripts & migrations
├── docker/            # Docker Compose
└── docs/              # Documentation
```

## Getting Started

1. Clone the repository
2. Install Docker Desktop
3. Run `docker compose -f docker/docker-compose.yml up -d`
4. Follow setup instructions in each service's README
