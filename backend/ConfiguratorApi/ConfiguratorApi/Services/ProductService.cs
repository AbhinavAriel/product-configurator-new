using ConfiguratorApi.Data;
using ConfiguratorApi.DTOs;
using ConfiguratorApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ConfiguratorApi.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;

    public ProductService(AppDbContext db)
    {
        _db = db;
    }

    // ─── Read ─────────────────────────────────────────────────────────────────

    public async Task<IEnumerable<ProductDto>> GetAllAsync(string? type, bool? active)
    {
        var query = _db.Products
            .Include(p => p.MaterialLayers.OrderBy(m => m.DisplayOrder))
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(type))
            query = query.Where(p => p.ProductType == type.ToLower());

        if (active.HasValue)
            query = query.Where(p => p.IsActive == active.Value);

        var products = await query
            .OrderBy(p => p.CreatedAt)
            .ToListAsync();

        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await _db.Products
            .Include(p => p.MaterialLayers.OrderBy(m => m.DisplayOrder))
            .FirstOrDefaultAsync(p => p.Id == id);

        return product is null ? null : MapToDto(product);
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    public async Task<ProductDto> CreateAsync(CreateProductRequest request)
    {
        var product = new Product
        {
            ProductType       = request.ProductType.ToLower(),
            ProductName       = request.ProductName,
            SleeveLength      = request.SleeveLength,
            ProductLengthDesc = request.ProductLengthDesc,
            Description       = request.Description,
            IsActive          = true,
            CreatedAt         = DateTime.UtcNow,
            UpdatedAt         = DateTime.UtcNow,
        };

        for (int i = 0; i < request.MaterialLayers.Count; i++)
        {
            var layerReq = request.MaterialLayers[i];
            product.MaterialLayers.Add(new MaterialLayer
            {
                LayerName           = layerReq.LayerName,
                MaterialName        = layerReq.MaterialName,
                Gsm                 = layerReq.Gsm,
                DefaultColourHex    = layerReq.DefaultColourHex,
                DefaultColourName   = layerReq.DefaultColourName,
                DefaultColourPantone = layerReq.DefaultColourPantone,
                DisplayOrder        = layerReq.DisplayOrder > 0 ? layerReq.DisplayOrder : i,
            });
        }

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        return MapToDto(product);
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    public async Task<ProductDto?> UpdateAsync(Guid id, UpdateProductRequest request)
    {
        var product = await _db.Products
            .Include(p => p.MaterialLayers)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null) return null;

        if (request.ProductName is not null)       product.ProductName       = request.ProductName;
        if (request.SleeveLength is not null)      product.SleeveLength      = request.SleeveLength;
        if (request.ProductLengthDesc is not null) product.ProductLengthDesc = request.ProductLengthDesc;
        if (request.Description is not null)       product.Description       = request.Description;
        if (request.IsActive.HasValue)             product.IsActive          = request.IsActive.Value;

        // Optionally replace all layers
        if (request.MaterialLayers is not null)
        {
            // Remove layers that are not in the update request
            var incomingIds = request.MaterialLayers
                .Where(l => l.Id.HasValue)
                .Select(l => l.Id!.Value)
                .ToHashSet();

            var toRemove = product.MaterialLayers
                .Where(m => !incomingIds.Contains(m.Id))
                .ToList();

            _db.MaterialLayers.RemoveRange(toRemove);

            for (int i = 0; i < request.MaterialLayers.Count; i++)
            {
                var layerReq = request.MaterialLayers[i];

                if (layerReq.Id.HasValue)
                {
                    // Update existing
                    var existing = product.MaterialLayers.FirstOrDefault(m => m.Id == layerReq.Id.Value);
                    if (existing is not null)
                    {
                        existing.LayerName           = layerReq.LayerName;
                        existing.MaterialName        = layerReq.MaterialName;
                        existing.Gsm                 = layerReq.Gsm;
                        existing.DefaultColourHex    = layerReq.DefaultColourHex;
                        existing.DefaultColourName   = layerReq.DefaultColourName;
                        existing.DefaultColourPantone = layerReq.DefaultColourPantone;
                        existing.DisplayOrder        = layerReq.DisplayOrder > 0 ? layerReq.DisplayOrder : i;
                    }
                }
                else
                {
                    // Add new layer
                    product.MaterialLayers.Add(new MaterialLayer
                    {
                        ProductId            = product.Id,
                        LayerName            = layerReq.LayerName,
                        MaterialName         = layerReq.MaterialName,
                        Gsm                  = layerReq.Gsm,
                        DefaultColourHex     = layerReq.DefaultColourHex,
                        DefaultColourName    = layerReq.DefaultColourName,
                        DefaultColourPantone = layerReq.DefaultColourPantone,
                        DisplayOrder         = layerReq.DisplayOrder > 0 ? layerReq.DisplayOrder : i,
                    });
                }
            }
        }

        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return MapToDto(product);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return false;

        product.IsActive  = false;
        product.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> HardDeleteAsync(Guid id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product is null) return false;

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return true;
    }

    // ─── Mapping ──────────────────────────────────────────────────────────────

    private static ProductDto MapToDto(Product p) => new()
    {
        Id                = p.Id,
        ProductType       = p.ProductType,
        ProductName       = p.ProductName,
        SleeveLength      = p.SleeveLength,
        ProductLengthDesc = p.ProductLengthDesc,
        Description       = p.Description,
        IsActive          = p.IsActive,
        CreatedAt         = p.CreatedAt,
        UpdatedAt         = p.UpdatedAt,
        MaterialLayers    = p.MaterialLayers
            .OrderBy(m => m.DisplayOrder)
            .Select(m => new MaterialLayerDto
            {
                Id                   = m.Id,
                LayerName            = m.LayerName,
                MaterialName         = m.MaterialName,
                Gsm                  = m.Gsm,
                DefaultColourHex     = m.DefaultColourHex,
                DefaultColourName    = m.DefaultColourName,
                DefaultColourPantone = m.DefaultColourPantone,
                DisplayOrder         = m.DisplayOrder,
            }).ToList(),
    };
}
