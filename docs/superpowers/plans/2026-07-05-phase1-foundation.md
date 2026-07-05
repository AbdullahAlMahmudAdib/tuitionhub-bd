# Phase 1: Foundation — Implementation Plan

> **For agentic workers:** Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task.

**Goal:** Set up the entire development environment, project scaffolding, authentication system (TDD), and CI/CD pipeline for TuitionHub BD.

**Architecture:** Clean Architecture with 4 .NET layers (Domain, Application, Infrastructure, Api) + Next.js 15 frontend with PWA support + FastAPI AI service skeleton. Auth uses JWT access + refresh tokens with rotation. All services containerized via Docker Compose.

**Tech Stack:** ASP.NET Core 9, Next.js 15, PostgreSQL 16, Redis 7, FastAPI, Docker, GitHub Actions

**Brand:** TuitionHub BD — Green (#10B981) + Blue (#3B82F6) primary palette

---

## Task 1: Git Repository & GitHub Setup

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: Nothing (root setup)
- Produces: Git repo with branch protection rules

- [ ] **Step 1: Initialize git repo and create .gitignore**

```
cd "/home/adib/Projects/Finding Your Tuition"

cat > .gitignore << 'GITIGNORE'
# .NET
bin/
obj/
*.user
*.suo
*.cache
*.log
.vs/

# Node
node_modules/
.next/
out/
.pnpm-store/

# Python
__pycache__/
*.pyc
.venv/
venv/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
docker-data/

# Environment
.env
.env.local
*.env

# Build
dist/
build/
GITIGNORE

git init
git add .gitignore
git commit -m "chore: initialize git repository with .gitignore"
```

- [ ] **Step 2: Create README.md**

```bash
cat > README.md << 'README'
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
README

git add README.md
git commit -m "docs: add project overview readme"
```

- [ ] **Step 3: Create GitHub Actions CI pipeline**

```bash
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'CIYAML'
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: "9.0.x"
      - run: dotnet restore
      - run: dotnet build --no-restore --configuration Release
      - run: dotnet test --no-build --configuration Release

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  ai-service:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./ai-service
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest
CIYAML

git add .github/
git commit -m "chore: add GitHub Actions CI pipeline"
```

- [ ] **Step 4: Create develop branch and push to GitHub**

```bash
git checkout -b develop
git remote add origin https://github.com/[your-org]/tuitionhub-bd.git
git push -u origin main
git push -u origin develop
```

---

## Task 2: Docker Compose Setup

**Files:**
- Create: `docker/docker-compose.yml`
- Create: `docker/Dockerfile.backend`
- Create: `docker/Dockerfile.frontend`
- Create: `docker/Dockerfile.ai`
- Create: `docker/.env.example`

**Interfaces:**
- Consumes: Nothing
- Produces: Local development environment with PostgreSQL + Redis

- [ ] **Step 1: Create Docker Compose file**

```bash
mkdir -p docker

cat > docker/docker-compose.yml << 'DOCKERCOMPOSE'
services:
  postgres:
    image: postgres:16-alpine
    container_name: tuitionhub-postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ../database/init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_DB: tuitionhub
      POSTGRES_USER: tuitionhub
      POSTGRES_PASSWORD: ${DB_PASSWORD:-tuitionhub_dev}
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tuitionhub"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: tuitionhub-redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ../backend
      dockerfile: ../docker/Dockerfile.backend
    container_name: tuitionhub-backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      ASPNETCORE_ENVIRONMENT: Development
      ASPNETCORE_URLS: http://0.0.0.0:8080
      ConnectionStrings__Default: Server=postgres;Port=5432;Database=tuitionhub;User Id=tuitionhub;Password=${DB_PASSWORD:-tuitionhub_dev}
      Redis__Connection: redis:6379
    ports:
      - "5000:8080"

  frontend:
    build:
      context: ../frontend
      dockerfile: ../docker/Dockerfile.frontend
    container_name: tuitionhub-frontend
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000/api
    ports:
      - "3000:3000"

  ai-service:
    build:
      context: ../ai-service
      dockerfile: ../docker/Dockerfile.ai
    container_name: tuitionhub-ai
    depends_on:
      redis:
        condition: service_healthy
    environment:
      REDIS_URL: redis://redis:6379
    ports:
      - "8000:8000"

volumes:
  pgdata:
DOCKERCOMPOSE
```

- [ ] **Step 2: Create Dockerfiles**

```bash
# Backend Dockerfile
cat > docker/Dockerfile.backend << 'DOCKERFILE'
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["TuitionHub.Api/TuitionHub.Api.csproj", "TuitionHub.Api/"]
COPY ["TuitionHub.Application/TuitionHub.Application.csproj", "TuitionHub.Application/"]
COPY ["TuitionHub.Domain/TuitionHub.Domain.csproj", "TuitionHub.Domain/"]
COPY ["TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj", "TuitionHub.Infrastructure/"]
RUN dotnet restore "TuitionHub.Api/TuitionHub.Api.csproj"
COPY . .
RUN dotnet publish "TuitionHub.Api/TuitionHub.Api.csproj" -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
EXPOSE 8080
COPY --from=build /app .
ENTRYPOINT ["dotnet", "TuitionHub.Api.dll"]
DOCKERFILE

# Frontend Dockerfile
cat > docker/Dockerfile.frontend << 'DOCKERFILE'
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
DOCKERFILE

# AI Service Dockerfile
cat > docker/Dockerfile.ai << 'DOCKERFILE'
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
DOCKERFILE
```

- [ ] **Step 3: Create .env.example**

```bash
cat > docker/.env.example << 'ENV'
DB_PASSWORD=tuitionhub_dev
JWT_SECRET=your-256-bit-secret-here-change-in-production
JWT_ISSUER=tuitionhub-bd
JWT_AUDIENCE=tuitionhub-api
REDIS_CONNECTION=redis:6379
ENV
```

- [ ] **Step 4: Commit**

```bash
git add docker/
git commit -m "chore: add Docker Compose and Dockerfiles for all services"
```

---

## Task 3: Backend Clean Architecture Scaffolding

**Files:**
- Create: `backend/TuitionHub-BD.sln`
- Create: `backend/TuitionHub.Domain/` (project)
- Create: `backend/TuitionHub.Application/` (project)
- Create: `backend/TuitionHub.Infrastructure/` (project)
- Create: `backend/TuitionHub.Api/` (project)
- Create: `database/init.sql`

**Interfaces:**
- Consumes: Docker setup (PostgreSQL)
- Produces: Solution with 4 projects following Clean Architecture

- [ ] **Step 1: Create solution and projects**

```bash
mkdir -p backend
cd backend

# Create solution
dotnet new sln -n TuitionHub-BD

# Create projects
dotnet new classlib -n TuitionHub.Domain
dotnet new classlib -n TuitionHub.Application
dotnet new classlib -n TuitionHub.Infrastructure
dotnet new webapi -n TuitionHub.Api --use-controllers

# Add to solution
dotnet sln add TuitionHub.Domain/TuitionHub.Domain.csproj
dotnet sln add TuitionHub.Application/TuitionHub.Application.csproj
dotnet sln add TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj
dotnet sln add TuitionHub.Api/TuitionHub.Api.csproj

# Set up project references (Application -> Domain, Infrastructure -> Application, Api -> Infrastructure)
dotnet add TuitionHub.Application/TuitionHub.Application.csproj reference TuitionHub.Domain/TuitionHub.Domain.csproj
dotnet add TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj reference TuitionHub.Application/TuitionHub.Application.csproj
dotnet add TuitionHub.Api/TuitionHub.Api.csproj reference TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj

# Remove default class files
rm TuitionHub.Domain/Class1.cs TuitionHub.Application/Class1.cs TuitionHub.Infrastructure/Class1.cs

cd ..
```

- [ ] **Step 2: Create Domain layer entities**

```bash
# Create directory structure
mkdir -p backend/TuitionHub.Domain/Entities
mkdir -p backend/TuitionHub.Domain/Enums
mkdir -p backend/TuitionHub.Domain/Interfaces
mkdir -p backend/TuitionHub.Domain/ValueObjects
mkdir -p backend/TuitionHub.Domain/Exceptions
```

Write `backend/TuitionHub.Domain/Enums/UserRole.cs`:
```csharp
namespace TuitionHub.Domain.Enums;

public enum UserRole
{
    SuperAdmin,
    SubAdmin,
    Guardian,
    Tutor
}
```

Write `backend/TuitionHub.Domain/Entities/User.cs`:
```csharp
using TuitionHub.Domain.Enums;

namespace TuitionHub.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; } = true;
    public decimal TrustScore { get; set; } = 5.00m;
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}
```

Write `backend/TuitionHub.Domain/Entities/RefreshToken.cs`:
```csharp
namespace TuitionHub.Domain.Entities;

public class RefreshToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string TokenHash { get; set; } = string.Empty;
    public string? DeviceInfo { get; set; }
    public string? IpAddress { get; set; }
    public DateTime ExpiresAt { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime? RevokedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsActive => !IsRevoked && !IsExpired;
}
```

Write `backend/TuitionHub.Domain/Entities/OtpCode.cs`:
```csharp
namespace TuitionHub.Domain.Entities;

public enum OtpType
{
    EmailVerification,
    PhoneVerification,
    PasswordReset
}

public class OtpCode
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Code { get; set; } = string.Empty;
    public OtpType Type { get; set; }
    public bool IsUsed { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsValid => !IsUsed && !IsExpired;
}
```

Write `backend/TuitionHub.Domain/Exceptions/DomainException.cs`:
```csharp
namespace TuitionHub.Domain.Exceptions;

public class DomainException : Exception
{
    public string Code { get; }

    public DomainException(string code, string message) : base(message)
    {
        Code = code;
    }
}
```

Write `backend/TuitionHub.Domain/Interfaces/IRepository.cs`:
```csharp
using System.Linq.Expressions;

namespace TuitionHub.Domain.Interfaces;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default);
    Task<IReadOnlyList<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default);
    Task<T> AddAsync(T entity, CancellationToken ct = default);
    Task UpdateAsync(T entity, CancellationToken ct = default);
    Task DeleteAsync(T entity, CancellationToken ct = default);
}
```

- [ ] **Step 3: Create Application layer base interfaces**

```bash
mkdir -p backend/TuitionHub.Application/Common/Interfaces
```

Write `backend/TuitionHub.Application/Common/Interfaces/IJwtService.cs`:
```csharp
using TuitionHub.Domain.Entities;

namespace TuitionHub.Application.Common.Interfaces;

public interface IJwtService
{
    (string accessToken, string refreshToken) GenerateTokenPair(User user);
    Guid? ValidateAccessToken(string token);
    string ComputeTokenHash(string token);
}
```

Write `backend/TuitionHub.Application/Common/Interfaces/IPasswordHasher.cs`:
```csharp
namespace TuitionHub.Application.Common.Interfaces;

public interface IPasswordHasher
{
    string Hash(string password);
    bool Verify(string password, string hash);
}
```

Write `backend/TuitionHub.Application/Common/Interfaces/IOtpService.cs`:
```csharp
using TuitionHub.Domain.Entities;

namespace TuitionHub.Application.Common.Interfaces;

public interface IOtpService
{
    string GenerateCode(int length = 6);
    Task<OtpCode> CreateOtpAsync(Guid userId, OtpType type, CancellationToken ct = default);
    Task<bool> ValidateOtpAsync(Guid userId, string code, OtpType type, CancellationToken ct = default);
}
```

- [ ] **Step 4: Create database init script**

```bash
mkdir -p database
```

Write `database/init.sql`:
```sql
-- TuitionHub BD — Database Initialization
-- This runs on first PostgreSQL container start

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'sub_admin', 'guardian', 'tutor');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE otp_type AS ENUM ('email_verification', 'phone_verification', 'password_reset');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    full_name VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'guardian',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    trust_score DECIMAL(3,2) DEFAULT 5.00 CHECK (trust_score >= 0 AND trust_score <= 5),
    avatar_url VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    device_info VARCHAR(500),
    ip_address VARCHAR(45),
    expires_at TIMESTAMPTZ NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at) WHERE is_revoked = FALSE;

-- OTP codes table
CREATE TABLE IF NOT EXISTS otp_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(6) NOT NULL,
    type otp_type NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_codes_user_type ON otp_codes(user_id, type);
```

- [ ] **Step 5: Seed super admin**

Append to `database/init.sql`:
```sql
-- Seed: Default super admin (password: Admin@123)
INSERT INTO users (email, phone, full_name, password_hash, role, is_verified, is_active)
VALUES (
    'admin@tuitionhubbd.com',
    '+8801700000000',
    'Super Admin',
    '$2a$11$K4YfGqJ1e4YHIpQq5q5q5e5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5',
    'super_admin',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;
```

- [ ] **Step 6: Install NuGet packages for Infrastructure and Api**

```bash
cd backend

# Infrastructure packages
dotnet add TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj package Microsoft.EntityFrameworkCore
dotnet add TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj package BCrypt.Net-Next
dotnet add TuitionHub.Infrastructure/TuitionHub.Infrastructure.csproj package Microsoft.Extensions.Caching.StackExchangeRedis

# Api packages
dotnet add TuitionHub.Api/TuitionHub.Api.csproj package MediatR
dotnet add TuitionHub.Api/TuitionHub.Api.csproj package AutoMapper
dotnet add TuitionHub.Api/TuitionHub.Api.csproj package Serilog.AspNetCore
dotnet add TuitionHub.Api/TuitionHub.Api.csproj package Microsoft.EntityFrameworkCore.Design

# Test project
dotnet new xunit -n TuitionHub.Api.Tests
dotnet sln add TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj
dotnet add TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj reference TuitionHub.Api/TuitionHub.Api.csproj
dotnet add TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj package Microsoft.AspNetCore.Mvc.Testing
dotnet add TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj package FluentAssertions
dotnet add TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj package Moq

cd ..
```

- [ ] **Step 7: Verify solution builds**

```bash
cd backend
dotnet build --configuration Release
cd ..
```

- [ ] **Step 8: Commit**

```bash
git add backend/ database/
git commit -m "feat: scaffold Clean Architecture solution with Domain entities and database init script"
```

---

## Task 4: JWT Auth — Register Endpoint (TDD)

**Files:**
- Create: `backend/TuitionHub.Application/Features/Auth/Commands/RegisterCommand.cs`
- Create: `backend/TuitionHub.Application/Features/Auth/Commands/RegisterCommandHandler.cs`
- Create: `backend/TuitionHub.Application/Features/Auth/DTOs/AuthResponse.cs`
- Create: `backend/TuitionHub.Infrastructure/Persistence/AppDbContext.cs`
- Create: `backend/TuitionHub.Infrastructure/Persistence/Repositories/EfRepository.cs`
- Create: `backend/TuitionHub.Infrastructure/Services/JwtService.cs`
- Create: `backend/TuitionHub.Infrastructure/Services/PasswordHasher.cs`
- Create: `backend/TuitionHub.Api/Controllers/AuthController.cs`
- Create: `backend/TuitionHub.Api/Middleware/ExceptionHandlingMiddleware.cs`
- Modify: `backend/TuitionHub.Api/Program.cs`
- Create: `backend/TuitionHub.Api.Tests/Controllers/AuthControllerTests.cs`
- Create: `backend/TuitionHub.Api.Tests/Integration/CustomWebApplicationFactory.cs`

**Interfaces:**
- Consumes: Domain entities, Database init
- Produces: Working POST /api/v1/auth/register endpoint

- [ ] **Step 1: Write the failing test for registration**

Write `backend/TuitionHub.Api.Tests/Controllers/AuthControllerTests.cs`:
```csharp
using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using TuitionHub.Application.Features.Auth.DTOs;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Api.Tests.Controllers;

public class AuthControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public AuthControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_WithValidGuardianData_ReturnsCreatedAndTokens()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "guardian@test.com",
            Phone = "+8801712345678",
            FullName = "Test Guardian",
            Password = "Test@123",
            Role = UserRole.Guardian
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        result.Should().NotBeNull();
        result!.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
        result.User.Email.Should().Be(request.Email);
    }

    [Fact]
    public async Task Register_WithDuplicateEmail_ReturnsConflict()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "duplicate@test.com",
            Phone = "+8801712345679",
            FullName = "Duplicate User",
            Password = "Test@123",
            Role = UserRole.Guardian
        };

        // First registration
        await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        // Act — duplicate
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task Register_WithInvalidEmail_ReturnsBadRequest()
    {
        // Arrange
        var request = new RegisterRequest
        {
            Email = "not-an-email",
            Phone = "+8801712345680",
            FullName = "Invalid Email",
            Password = "Test@123",
            Role = UserRole.Guardian
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
```

- [ ] **Step 2: Run test — expect it to fail**

```bash
cd backend
dotnet test TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj --filter "Register_" --no-restore
```

Expected output: Build fails because types don't exist yet.

- [ ] **Step 3: Create Auth DTOs**

Write `backend/TuitionHub.Application/Features/Auth/DTOs/AuthResponse.cs`:
```csharp
using TuitionHub.Domain.Enums;

namespace TuitionHub.Application.Features.Auth.DTOs;

public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    UserDto User
);

public record UserDto(
    Guid Id,
    string Email,
    string FullName,
    UserRole Role,
    bool IsVerified
);

public record RegisterRequest(
    string Email,
    string Phone,
    string FullName,
    string Password,
    UserRole Role
);

public record LoginRequest(
    string Email,
    string Password
);

public record RefreshTokenRequest(
    string RefreshToken
);
```

- [ ] **Step 4: Create Register command and handler**

Write `backend/TuitionHub.Application/Features/Auth/Commands/RegisterCommand.cs`:
```csharp
using MediatR;
using TuitionHub.Application.Features.Auth.DTOs;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Application.Features.Auth.Commands;

public record RegisterCommand(
    string Email,
    string Phone,
    string FullName,
    string Password,
    UserRole Role
) : IRequest<AuthResponse>;
```

Write `backend/TuitionHub.Application/Features/Auth/Commands/RegisterCommandHandler.cs`:
```csharp
using MediatR;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Application.Features.Auth.DTOs;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Enums;
using TuitionHub.Domain.Exceptions;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponse>
{
    private readonly IRepository<User> _userRepo;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public RegisterCommandHandler(
        IRepository<User> userRepo,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _userRepo = userRepo;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if email already exists
        var existingUsers = await _userRepo.FindAsync(
            u => u.Email == request.Email, cancellationToken);
        if (existingUsers.Any())
        {
            throw new DomainException("EMAIL_EXISTS", "A user with this email already exists");
        }

        // Create user
        var user = new User
        {
            Email = request.Email.ToLowerInvariant().Trim(),
            Phone = request.Phone,
            FullName = request.FullName,
            PasswordHash = _passwordHasher.Hash(request.Password),
            Role = request.Role,
            IsVerified = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepo.AddAsync(user, cancellationToken);

        // Generate tokens
        var (accessToken, refreshToken) = _jwtService.GenerateTokenPair(user);

        return new AuthResponse(
            accessToken,
            refreshToken,
            new UserDto(user.Id, user.Email, user.FullName, user.Role, user.IsVerified)
        );
    }
}
```

- [ ] **Step 5: Create EF Core DbContext**

Write `backend/TuitionHub.Infrastructure/Persistence/AppDbContext.cs`:
```csharp
using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<OtpCode> OtpCodes => Set<OtpCode>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Phone);
            entity.Property(e => e.Role).HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.Email).HasMaxLength(255).IsRequired();
            entity.Property(e => e.FullName).HasMaxLength(150).IsRequired();
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.TrustScore).HasColumnType("decimal(3,2)");
            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.TokenHash).IsRequired();
        });

        modelBuilder.Entity<OtpCode>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.Type });
            entity.Property(e => e.Type).HasConversion<string>().HasMaxLength(30);
        });
    }
}
```

- [ ] **Step 6: Create EF Repository**

Write `backend/TuitionHub.Infrastructure/Persistence/Repositories/EfRepository.cs`:
```csharp
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Infrastructure.Persistence.Repositories;

public class EfRepository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public EfRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await _dbSet.FindAsync([id], ct);

    public async Task<IReadOnlyList<T>> GetAllAsync(CancellationToken ct = default)
        => await _dbSet.ToListAsync(ct);

    public async Task<IReadOnlyList<T>> FindAsync(
        Expression<Func<T, bool>> predicate, CancellationToken ct = default)
        => await _dbSet.Where(predicate).ToListAsync(ct);

    public async Task<T> AddAsync(T entity, CancellationToken ct = default)
    {
        var entry = await _dbSet.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);
        return entry.Entity;
    }

    public Task UpdateAsync(T entity, CancellationToken ct = default)
    {
        _dbSet.Update(entity);
        return _context.SaveChangesAsync(ct);
    }

    public Task DeleteAsync(T entity, CancellationToken ct = default)
    {
        _dbSet.Remove(entity);
        return _context.SaveChangesAsync(ct);
    }
}
```

- [ ] **Step 7: Create JwtService**

Write `backend/TuitionHub.Infrastructure/Services/JwtService.cs`:
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Domain.Entities;

namespace TuitionHub.Infrastructure.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public (string accessToken, string refreshToken) GenerateTokenPair(User user)
    {
        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken();
        return (accessToken, refreshToken);
    }

    private string GenerateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("is_verified", user.IsVerified.ToString().ToLower())
        };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public Guid? ValidateAccessToken(string token)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));

        try
        {
            var handler = new JwtSecurityTokenHandler();
            var principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = key,
                ValidateIssuer = true,
                ValidIssuer = _config["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _config["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out _);

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return userId != null ? Guid.Parse(userId) : null;
        }
        catch
        {
            return null;
        }
    }

    public string ComputeTokenHash(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }
}
```

- [ ] **Step 8: Create PasswordHasher**

Write `backend/TuitionHub.Infrastructure/Services/PasswordHasher.cs`:
```csharp
using TuitionHub.Application.Common.Interfaces;

namespace TuitionHub.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
    public string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password, workFactor: 11);

    public bool Verify(string password, string hash)
        => BCrypt.Net.BCrypt.Verify(password, hash);
}
```

- [ ] **Step 9: Create AuthController**

Write `backend/TuitionHub.Api/Controllers/AuthController.cs`:
```csharp
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TuitionHub.Application.Features.Auth.Commands;
using TuitionHub.Application.Features.Auth.DTOs;

namespace TuitionHub.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request,
        CancellationToken ct)
    {
        var command = new RegisterCommand(
            request.Email, request.Phone, request.FullName,
            request.Password, request.Role);

        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(Register), result);
    }
}
```

- [ ] **Step 10: Create Exception Handling Middleware**

Write `backend/TuitionHub.Api/Middleware/ExceptionHandlingMiddleware.cs`:
```csharp
using System.Net;
using System.Text.Json;
using TuitionHub.Domain.Exceptions;

namespace TuitionHub.Api.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainException ex)
        {
            _logger.LogWarning("Domain exception: {Code} — {Message}", ex.Code, ex.Message);
            context.Response.StatusCode = ex.Code switch
            {
                "EMAIL_EXISTS" => (int)HttpStatusCode.Conflict,
                "INVALID_CREDENTIALS" => (int)HttpStatusCode.Unauthorized,
                "TOKEN_EXPIRED" => (int)HttpStatusCode.Unauthorized,
                _ => (int)HttpStatusCode.BadRequest
            };
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                success = false,
                data = (object?)null,
                message = ex.Message,
                errors = new[] { new { code = ex.Code, message = ex.Message } }
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                success = false,
                data = (object?)null,
                message = "An internal error occurred",
                errors = Array.Empty<object>()
            }));
        }
    }
}
```

- [ ] **Step 11: Configure Program.cs**

Write `backend/TuitionHub.Api/Program.cs`:
```csharp
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TuitionHub.Api.Middleware;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Domain.Interfaces;
using TuitionHub.Infrastructure.Persistence;
using TuitionHub.Infrastructure.Persistence.Repositories;
using TuitionHub.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Auth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// DI — Repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));

// DI — Services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

// MediatR
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Middleware pipeline
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Auto-migrate database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.Run();

// Make Program accessible to test project
public partial class Program { }
```

Write `backend/TuitionHub.Api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Port=5432;Database=tuitionhub;User Id=tuitionhub;Password=tuitionhub_dev;"
  },
  "Jwt": {
    "Secret": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
    "Issuer": "tuitionhub-bd",
    "Audience": "tuitionhub-api"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

- [ ] **Step 12: Create test factory**

Write `backend/TuitionHub.Api.Tests/Integration/CustomWebApplicationFactory.cs`:
```csharp
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TuitionHub.Infrastructure.Persistence;

namespace TuitionHub.Api.Tests.Integration;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureTestServices(services =>
        {
            // Use in-memory database for tests
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
            if (descriptor != null) services.Remove(descriptor);

            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase("TuitionHubTestDb");
            });
        });
    }
}
```

- [ ] **Step 13: Run tests — expect them to pass now**

```bash
cd backend
dotnet add TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj package Microsoft.EntityFrameworkCore.InMemory

# Build and test
dotnet build
dotnet test TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj --filter "Register_" -v n
```

Expected output: all 3 tests pass (Register_WithValidGuardianData_ReturnsCreatedAndTokens, Register_WithDuplicateEmail_ReturnsConflict, Register_WithInvalidEmail_ReturnsBadRequest)

- [ ] **Step 14: Commit**

```bash
git add backend/
git commit -m "feat: implement auth register endpoint with JWT token generation (TDD)"
```

---

## Task 5: Auth — Login & Refresh Endpoints (TDD)

**Files:**
- Create: `backend/TuitionHub.Application/Features/Auth/Commands/LoginCommand.cs`
- Create: `backend/TuitionHub.Application/Features/Auth/Commands/LoginCommandHandler.cs`
- Create: `backend/TuitionHub.Application/Features/Auth/Commands/RefreshTokenCommand.cs`
- Create: `backend/TuitionHub.Application/Features/Auth/Commands/RefreshTokenCommandHandler.cs`
- Modify: `backend/TuitionHub.Api/Controllers/AuthController.cs` (add login, refresh endpoints)
- Create: `backend/TuitionHub.Api.Tests/Controllers/AuthControllerLoginTests.cs`

**Interfaces:**
- Consumes: JwtService, PasswordHasher, UserRepo, RefreshTokenRepo
- Produces: Full auth cycle: register → login → refresh

- [ ] **Step 1: Write failing tests**

Write `backend/TuitionHub.Api.Tests/Controllers/AuthControllerLoginTests.cs`:
```csharp
using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using TuitionHub.Application.Features.Auth.DTOs;
using TuitionHub.Domain.Enums;

namespace TuitionHub.Api.Tests.Controllers;

public class AuthControllerLoginTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public AuthControllerLoginTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task<AuthResponse> RegisterTestUser(string email, UserRole role = UserRole.Guardian)
    {
        var request = new RegisterRequest
        {
            Email = email,
            Phone = "+8801712345690",
            FullName = "Test User",
            Password = "Test@123",
            Role = role
        };
        var response = await _client.PostAsJsonAsync("/api/v1/auth/register", request);
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        return result!;
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOkAndTokens()
    {
        // Arrange — register first
        await RegisterTestUser("logintest@test.com");

        var loginRequest = new LoginRequest
        {
            Email = "logintest@test.com",
            Password = "Test@123"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", loginRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        result!.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Login_WithWrongPassword_ReturnsUnauthorized()
    {
        await RegisterTestUser("wrongpw@test.com");

        var loginRequest = new LoginRequest
        {
            Email = "wrongpw@test.com",
            Password = "WrongPassword123!"
        };

        var response = await _client.PostAsJsonAsync("/api/v1/auth/login", loginRequest);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task RefreshToken_WithValidToken_ReturnsNewTokenPair()
    {
        // Arrange — register + login
        var auth = await RegisterTestUser("refreshtest@test.com");

        var refreshRequest = new RefreshTokenRequest(auth.RefreshToken);

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/auth/refresh", refreshRequest);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<AuthResponse>();
        result!.AccessToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBeNullOrEmpty();
        result.RefreshToken.Should().NotBe(auth.RefreshToken); // rotated
    }

    [Fact]
    public async Task RefreshToken_WithRevokedToken_ReturnsUnauthorized()
    {
        var auth = await RegisterTestUser("revokedrefresh@test.com");

        var refreshRequest = new RefreshTokenRequest(auth.RefreshToken);

        // First refresh — consumes old token
        await _client.PostAsJsonAsync("/api/v1/auth/refresh", refreshRequest);
        // Second refresh with same (now revoked) token
        var response = await _client.PostAsJsonAsync("/api/v1/auth/refresh", refreshRequest);

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
```

- [ ] **Step 2: Create LoginCommand and Handler**

Write `backend/TuitionHub.Application/Features/Auth/Commands/LoginCommand.cs`:
```csharp
using MediatR;
using TuitionHub.Application.Features.Auth.DTOs;

namespace TuitionHub.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password) : IRequest<AuthResponse>;
```

Write `backend/TuitionHub.Application/Features/Auth/Commands/LoginCommandHandler.cs`:
```csharp
using MediatR;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Application.Features.Auth.DTOs;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Exceptions;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Auth.Commands;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{
    private readonly IRepository<User> _userRepo;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtService _jwtService;

    public LoginCommandHandler(
        IRepository<User> userRepo,
        IPasswordHasher passwordHasher,
        IJwtService jwtService)
    {
        _userRepo = userRepo;
        _passwordHasher = passwordHasher;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var users = await _userRepo.FindAsync(
            u => u.Email == request.Email.ToLowerInvariant().Trim(), cancellationToken);
        var user = users.FirstOrDefault();

        if (user == null || !_passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw new DomainException("INVALID_CREDENTIALS", "Invalid email or password");
        }

        var (accessToken, refreshToken) = _jwtService.GenerateTokenPair(user);

        return new AuthResponse(
            accessToken,
            refreshToken,
            new UserDto(user.Id, user.Email, user.FullName, user.Role, user.IsVerified)
        );
    }
}
```

- [ ] **Step 3: Create RefreshTokenCommand and Handler**

Write `backend/TuitionHub.Application/Features/Auth/Commands/RefreshTokenCommand.cs`:
```csharp
using MediatR;
using TuitionHub.Application.Features.Auth.DTOs;

namespace TuitionHub.Application.Features.Auth.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<AuthResponse>;
```

Write `backend/TuitionHub.Application/Features/Auth/Commands/RefreshTokenCommandHandler.cs`:
```csharp
using MediatR;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Application.Features.Auth.DTOs;
using TuitionHub.Domain.Entities;
using TuitionHub.Domain.Exceptions;
using TuitionHub.Domain.Interfaces;

namespace TuitionHub.Application.Features.Auth.Commands;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    private readonly IRepository<RefreshToken> _refreshTokenRepo;
    private readonly IRepository<User> _userRepo;
    private readonly IJwtService _jwtService;

    public RefreshTokenCommandHandler(
        IRepository<RefreshToken> refreshTokenRepo,
        IRepository<User> userRepo,
        IJwtService jwtService)
    {
        _refreshTokenRepo = refreshTokenRepo;
        _userRepo = userRepo;
        _jwtService = jwtService;
    }

    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var tokenHash = _jwtService.ComputeTokenHash(request.RefreshToken);

        var tokens = await _refreshTokenRepo.FindAsync(
            t => t.TokenHash == tokenHash, cancellationToken);
        var storedToken = tokens.FirstOrDefault();

        if (storedToken == null || !storedToken.IsActive)
        {
            throw new DomainException("INVALID_TOKEN", "Refresh token is invalid or expired");
        }

        // Revoke old token (rotation)
        storedToken.IsRevoked = true;
        storedToken.RevokedAt = DateTime.UtcNow;
        await _refreshTokenRepo.UpdateAsync(storedToken, cancellationToken);

        // Get user and generate new pair
        var user = await _userRepo.GetByIdAsync(storedToken.UserId, cancellationToken);
        if (user == null)
        {
            throw new DomainException("USER_NOT_FOUND", "User no longer exists");
        }

        var (accessToken, newRefreshToken) = _jwtService.GenerateTokenPair(user);

        return new AuthResponse(
            accessToken,
            newRefreshToken,
            new UserDto(user.Id, user.Email, user.FullName, user.Role, user.IsVerified)
        );
    }
}
```

- [ ] **Step 4: Update AuthController with login and refresh endpoints**

Append to `backend/TuitionHub.Api/Controllers/AuthController.cs`:

```csharp
[HttpPost("login")]
[ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public async Task<IActionResult> Login([FromBody] LoginRequest request,
    CancellationToken ct)
{
    var command = new LoginCommand(request.Email, request.Password);
    var result = await _mediator.Send(command, ct);
    return Ok(result);
}

[HttpPost("refresh")]
[ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request,
    CancellationToken ct)
{
    var command = new RefreshTokenCommand(request.RefreshToken);
    var result = await _mediator.Send(command, ct);
    return Ok(result);
}
```

- [ ] **Step 5: Register MediatR handlers from Application assembly**

Update `backend/TuitionHub.Api/Program.cs` — change MediatR registration to scan Application assembly:

```csharp
using TuitionHub.Application;

// Replace existing MediatR line with:
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssemblyContaining<RegisterCommandHandler>());
```

Actually, since RegisterCommandHandler is in Application layer, reference it properly. Create a marker class:

Write `backend/TuitionHub.Application/AssemblyMarker.cs`:
```csharp
namespace TuitionHub.Application;

/// <summary>
/// Used by MediatR registration to scan the Application assembly.
/// </summary>
public sealed class AssemblyMarker { }
```

Then update Program.cs:
```csharp
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssemblyContaining<TuitionHub.Application.AssemblyMarker>());
```

- [ ] **Step 6: Run tests**

```bash
cd backend
dotnet build
dotnet test TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj --filter "Login_|RefreshToken_" -v n
```

Expected: all 4 tests pass.

- [ ] **Step 7: Commit**

```bash
git add backend/
git commit -m "feat: implement login and refresh token rotation (TDD)"
```

---

## Task 6: Frontend — Next.js 15 Project with PWA

**Files:**
- Create: `frontend/` (Next.js 15 project)
- Create: `frontend/public/manifest.json`
- Create: `frontend/src/app/layout.tsx`
- Create: `frontend/src/app/page.tsx`
- Modify: `frontend/package.json` (add PWA dependencies)

**Interfaces:**
- Consumes: Nothing (standalone project)
- Produces: Next.js app with PWA support, Tailwind CSS v4, shadcn/ui

- [ ] **Step 1: Scaffold Next.js 15 project**

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd ..
```

- [ ] **Step 2: Create PWA manifest**

Write `frontend/public/manifest.json`:
```json
{
  "name": "TuitionHub BD",
  "short_name": "TuitionHub",
  "description": "Bangladesh's trusted tuition marketplace",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10B981",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 3: Update layout with PWA meta tags**

Write `frontend/src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TuitionHub BD — Find Your Perfect Tutor",
  description:
    "Bangladesh's trusted tuition marketplace. Connect with verified tutors or find teaching jobs near you.",
  manifest: "/manifest.json",
  themeColor: "#10B981",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "TuitionHub" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Create landing page placeholder**

Write `frontend/src/app/page.tsx`:
```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          TuitionHub <span className="text-emerald-500">BD</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Bangladesh&apos;s trusted marketplace for private tuition.
          <br />
          Find the perfect tutor or discover teaching opportunities near you.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/register/tutor"
            className="rounded-lg bg-emerald-500 px-8 py-3 text-white font-semibold hover:bg-emerald-600 transition"
          >
            I&apos;m a Tutor
          </a>
          <a
            href="/register/guardian"
            className="rounded-lg border-2 border-emerald-500 px-8 py-3 text-emerald-600 font-semibold hover:bg-emerald-50 transition"
          >
            I&apos;m a Guardian
          </a>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Configure Tailwind v4 with brand colors**

Update `frontend/src/app/globals.css`:
```css
@import "tailwindcss";

@theme {
  --color-primary: #10B981;
  --color-primary-dark: #059669;
  --color-secondary: #3B82F6;
  --color-accent: #06B6D4;
}
```

- [ ] **Step 6: Create icons directory with placeholder SVGs**

```bash
mkdir -p frontend/public/icons

# Simple SVG-based icon
cat > frontend/public/icons/icon-192.svg << 'SVG'
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="32" fill="#10B981"/>
  <text x="96" y="120" font-family="Arial" font-size="80" font-weight="bold" fill="white" text-anchor="middle">T</text>
</svg>
SVG
```

- [ ] **Step 7: Install service worker support**

```bash
cd frontend
npm install next-pwa
cd ..
```

Write `frontend/next.config.ts`:
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 8: Verify frontend builds**

```bash
cd frontend
npm run build
cd ..
```

Expected: Build succeeds, PWA manifest is linked.

- [ ] **Step 9: Commit**

```bash
git add frontend/
git commit -m "feat: scaffold Next.js 15 frontend with PWA support and brand styling"
```

---

## Task 7: AI Service Skeleton

**Files:**
- Create: `ai-service/app/main.py`
- Create: `ai-service/app/api/health.py`
- Create: `ai-service/requirements.txt`
- Create: `ai-service/tests/test_health.py`

**Interfaces:**
- Consumes: Nothing
- Produces: FastAPI service with health endpoint

- [ ] **Step 1: Create FastAPI application**

Write `ai-service/app/main.py`:
```python
from fastapi import FastAPI
from app.api.health import router as health_router

app = FastAPI(
    title="TuitionHub AI Service",
    description="Matching engine, fuzzy search, salary prediction, fraud detection",
    version="0.1.0",
)

app.include_router(health_router, prefix="/api/v1", tags=["health"])
```

- [ ] **Step 2: Create health endpoint**

Write `ai-service/app/__init__.py`:
```python
```

Write `ai-service/app/api/__init__.py`:
```python
```

Write `ai-service/app/api/health.py`:
```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service", "version": "0.1.0"}
```

- [ ] **Step 3: Create requirements.txt**

Write `ai-service/requirements.txt`:
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
pydantic==2.10.0
pydantic-settings==2.6.0
redis==5.2.0
scikit-learn==1.6.0
numpy==2.2.0
pandas==2.2.0
pytest==8.3.0
httpx==0.28.0
```

- [ ] **Step 4: Create health test**

Write `ai-service/tests/test_health.py`:
```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.anyio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "ai-service"
```

- [ ] **Step 5: Run AI service tests**

```bash
cd ai-service
pip install -r requirements.txt
pip install pytest-asyncio
pytest tests/ -v
cd ..
```

Expected: 1 test passes.

- [ ] **Step 6: Commit**

```bash
git add ai-service/
git commit -m "feat: scaffold FastAPI AI service with health endpoint (TDD)"
```

---

## Task 8: Database Migrations & Verification

**Files:**
- Run EF Core initial migration
- Verify all containers start with Docker Compose

- [ ] **Step 1: Create initial EF Core migration**

```bash
cd backend
dotnet tool install --global dotnet-ef --version 9.0.0
dotnet ef migrations add InitialCreate --project TuitionHub.Infrastructure --startup-project TuitionHub.Api
cd ..
```

Expected: Migration files created in TuitionHub.Infrastructure/Migrations/

- [ ] **Step 2: Start Docker Compose and verify**

```bash
docker compose -f docker/docker-compose.yml up -d

# Check all containers are running
docker ps

# Test backend health
curl -s http://localhost:5000/health || echo "Backend not yet configured with health endpoint"

# Test PostgreSQL
docker exec tuitionhub-postgres psql -U tuitionhub -d tuitionhub -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"

# Test Redis
docker exec tuitionhub-redis redis-cli ping
```

- [ ] **Step 3: Add backend health endpoint if not present**

Create `backend/TuitionHub.Api/Controllers/HealthController.cs`:
```csharp
using Microsoft.AspNetCore.Mvc;

namespace TuitionHub.Api.Controllers;

[ApiController]
[Route("api/v1")]
public class HealthController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new
        {
            status = "healthy",
            service = "tuitionhub-api",
            version = "0.1.0",
            timestamp = DateTime.UtcNow
        });
    }
}
```

- [ ] **Step 4: Full integration test**

```bash
# Build and run
cd backend && dotnet build && cd ..

# Run all backend tests
cd backend && dotnet test TuitionHub.Api.Tests/TuitionHub.Api.Tests.csproj -v n && cd ..

# Run all AI service tests
cd ai-service && pytest tests/ -v && cd ..

# Run frontend build check
cd frontend && npm run build && cd ..
```

All should pass.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 1 foundation with database migrations and integration tests"
git push origin develop
```

---

## Phase 1 Completion Checklist

- [ ] Git repo initialized with .gitignore, README, CI pipeline
- [ ] Docker Compose with PostgreSQL 16 + Redis 7 running
- [ ] Clean Architecture solution with 4 .NET projects
- [ ] Domain entities: User, RefreshToken, OtpCode
- [ ] Auth TDD: Register (3 tests), Login (2 tests), Refresh (2 tests) — all passing
- [ ] JWT access + refresh token rotation implemented
- [ ] Exception handling middleware with structured error responses
- [ ] Database init script with indexes
- [ ] EF Core initial migration generated
- [ ] Next.js 15 frontend with PWA manifest + service worker scaffolding
- [ ] FastAPI AI service skeleton with health endpoint
- [ ] All services containerized and running on `docker compose up`
- [ ] GitHub Actions CI passing

---

> **Plan complete and saved to `docs/superpowers/plans/2026-07-05-phase1-foundation.md`.** Two execution options:
>
> **1. Subagent-Driven (recommended)** — Dispatch fresh subagent per task, review between tasks
>
> **2. Inline Execution** — Execute tasks in this session using executing-plans
>
> **Which approach?**
