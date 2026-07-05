using System.Security.Cryptography;
using System.Text;
using TuitionHub.Application.Common.Interfaces;

namespace TuitionHub.Infrastructure.Services;

public sealed class AuthService : IAuthService
{
    private const int SaltRounds = 12;

    public string GenerateAccessToken(Domain.Entities.User user)
    {
        // JWT generation is delegated to IJwtService
        throw new NotImplementedException("Use IJwtService for access token generation");
    }

    public string GenerateRefreshToken()
    {
        var buffer = new byte[64];
        RandomNumberGenerator.Fill(buffer);
        return Convert.ToBase64String(buffer);
    }

    public string HashToken(string token)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
        return Convert.ToBase64String(bytes);
    }

    public string HashPassword(string password)
        => BCrypt.Net.BCrypt.HashPassword(password, SaltRounds);

    public bool VerifyPassword(string password, string hash)
        => BCrypt.Net.BCrypt.Verify(password, hash);
}
