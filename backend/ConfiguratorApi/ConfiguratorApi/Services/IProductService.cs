using ConfiguratorApi.DTOs;

namespace ConfiguratorApi.Services;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(string? type, bool? active);
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<ProductDto> CreateAsync(CreateProductRequest request);
    Task<ProductDto?> UpdateAsync(Guid id, UpdateProductRequest request);
    Task<bool> DeleteAsync(Guid id); // soft delete
    Task<bool> HardDeleteAsync(Guid id);
}
