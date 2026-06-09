using ConfiguratorApi.DTOs;
using ConfiguratorApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ConfiguratorApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    /// <summary>
    /// Get all products. Optionally filter by type and/or active status.
    /// </summary>
    /// <param name="type">Filter by product type: tshirt | bag | mobilecase | shorts</param>
    /// <param name="active">Filter by active status (default: returns all)</param>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? type = null,
        [FromQuery] bool? active = null)
    {
        _logger.LogInformation("GET /api/products — type={Type}, active={Active}", type, active);
        var products = await _productService.GetAllAsync(type, active);
        return Ok(products);
    }

    /// <summary>
    /// Get a single product by ID, including its material layers.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        _logger.LogInformation("GET /api/products/{Id}", id);
        var product = await _productService.GetByIdAsync(id);
        if (product is null)
            return NotFound(new { message = $"Product {id} not found." });

        return Ok(product);
    }

    /// <summary>
    /// Create a new product with optional material layers.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateProductRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _logger.LogInformation("POST /api/products — {ProductName} ({Type})", request.ProductName, request.ProductType);
        var created = await _productService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Update a product's metadata and/or material layers.
    /// All fields are optional — only provided fields are updated.
    /// </summary>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ProductDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        _logger.LogInformation("PUT /api/products/{Id}", id);
        var updated = await _productService.UpdateAsync(id, request);
        if (updated is null)
            return NotFound(new { message = $"Product {id} not found." });

        return Ok(updated);
    }

    /// <summary>
    /// Soft-delete a product (sets isActive = false). Data is preserved.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        _logger.LogInformation("DELETE /api/products/{Id}", id);
        var success = await _productService.DeleteAsync(id);
        if (!success)
            return NotFound(new { message = $"Product {id} not found." });

        return NoContent();
    }

    /// <summary>
    /// Permanently delete a product and all its material layers. Use with caution.
    /// </summary>
    [HttpDelete("{id:guid}/hard")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> HardDelete(Guid id)
    {
        _logger.LogWarning("HARD DELETE /api/products/{Id}", id);
        var success = await _productService.HardDeleteAsync(id);
        if (!success)
            return NotFound(new { message = $"Product {id} not found." });

        return NoContent();
    }
}
