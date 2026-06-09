using ConfiguratorApi.Data;
using ConfiguratorApi.DTOs;
using ConfiguratorApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ConfiguratorApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ConfigurationsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<ConfigurationsController> _logger;

    public ConfigurationsController(AppDbContext db, ILogger<ConfigurationsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    /// <summary>
    /// Get all saved configurations (optionally filter by productId).
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<SavedConfigurationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] Guid? productId = null)
    {
        var query = _db.SavedConfigurations.AsQueryable();

        if (productId.HasValue)
            query = query.Where(c => c.ProductId == productId.Value);

        var configs = await query.OrderByDescending(c => c.CreatedAt).ToListAsync();

        var result = configs.Select(c => new SavedConfigurationDto
        {
            Id        = c.Id,
            ProductId = c.ProductId,
            Name      = c.Name,
            ConfigJson = TryParseJson(c.ConfigJson),
            CreatedAt = c.CreatedAt,
        });

        return Ok(result);
    }

    /// <summary>
    /// Get a single saved configuration by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(SavedConfigurationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var config = await _db.SavedConfigurations.FindAsync(id);
        if (config is null)
            return NotFound(new { message = $"Configuration {id} not found." });

        return Ok(new SavedConfigurationDto
        {
            Id         = config.Id,
            ProductId  = config.ProductId,
            Name       = config.Name,
            ConfigJson = TryParseJson(config.ConfigJson),
            CreatedAt  = config.CreatedAt,
        });
    }

    /// <summary>
    /// Save a new design configuration (the full ProductConfig JSON from the frontend).
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(SavedConfigurationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Save([FromBody] SaveConfigurationRequest request)
    {
        // Verify product exists
        var productExists = await _db.Products.AnyAsync(p => p.Id == request.ProductId);
        if (!productExists)
            return BadRequest(new { message = $"Product {request.ProductId} not found." });

        var jsonString = JsonSerializer.Serialize(request.ConfigJson);

        var config = new SavedConfiguration
        {
            ProductId  = request.ProductId,
            Name       = request.Name,
            ConfigJson = jsonString,
            CreatedAt  = DateTime.UtcNow,
        };

        _db.SavedConfigurations.Add(config);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Saved configuration {Id} for product {ProductId}", config.Id, config.ProductId);

        return CreatedAtAction(nameof(GetById), new { id = config.Id }, new SavedConfigurationDto
        {
            Id         = config.Id,
            ProductId  = config.ProductId,
            Name       = config.Name,
            ConfigJson = TryParseJson(config.ConfigJson),
            CreatedAt  = config.CreatedAt,
        });
    }

    /// <summary>
    /// Delete a saved configuration permanently.
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var config = await _db.SavedConfigurations.FindAsync(id);
        if (config is null)
            return NotFound(new { message = $"Configuration {id} not found." });

        _db.SavedConfigurations.Remove(config);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private static object? TryParseJson(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<object>(json);
        }
        catch
        {
            return json;
        }
    }
}
