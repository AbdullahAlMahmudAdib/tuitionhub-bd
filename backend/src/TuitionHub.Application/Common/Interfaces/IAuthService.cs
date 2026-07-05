using TuitionHub.Domain.Entities;

namespace TuitionHub.Application.Common.Interfaces;

public interface IAuthService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    string HashToken(string token);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hash);
}
