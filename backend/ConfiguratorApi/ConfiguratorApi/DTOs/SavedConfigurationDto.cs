namespace ConfiguratorApi.DTOs;

public class SavedConfigurationDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string? Name { get; set; }
    public object? ConfigJson { get; set; } // deserialized JSON
    public DateTime CreatedAt { get; set; }
}

public class SaveConfigurationRequest
{
    public Guid ProductId { get; set; }
    public string? Name { get; set; }

    /// <summary>
    /// The full ProductConfig JSON from the frontend.
    /// </summary>
    public object ConfigJson { get; set; } = new { };
}
