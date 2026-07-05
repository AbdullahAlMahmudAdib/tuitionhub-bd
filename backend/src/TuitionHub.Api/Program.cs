using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TuitionHub.Application.Common.Behaviors;
using TuitionHub.Application.Common.Interfaces;
using TuitionHub.Domain.Interfaces;
using TuitionHub.Infrastructure.Auth;
using TuitionHub.Infrastructure.Persistence;
using TuitionHub.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────────────────
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// ── Auth ──────────────────────────────────────────────────────────
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// ── Repositories ──────────────────────────────────────────────────
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<ITutorProfileRepository, TutorProfileRepository>();
builder.Services.AddScoped<IGuardianProfileRepository, GuardianProfileRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IVerificationRepository, VerificationRepository>();

// ── MediatR + FluentValidation ────────────────────────────────────
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(TuitionHub.Application.Common.Interfaces.IAuthService).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
});
builder.Services.AddValidatorsFromAssembly(typeof(TuitionHub.Application.Features.Auth.Commands.Register.RegisterCommand).Assembly);

// ── API ───────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.Run();
