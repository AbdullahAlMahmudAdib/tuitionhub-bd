using System.Security.Claims;
using TuitionHub.Domain.Entities;

namespace TuitionHub.Application.Common.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
}
