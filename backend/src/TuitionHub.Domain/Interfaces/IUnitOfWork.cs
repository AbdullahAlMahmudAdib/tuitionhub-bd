namespace TuitionHub.Domain.Interfaces;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task AddAsync<TEntity>(TEntity entity, CancellationToken ct = default) where TEntity : class;
}
