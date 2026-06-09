namespace ConfiguratorApi.DTOs;

public class MaterialLayerDto
{
    public Guid Id { get; set; }
    public string LayerName { get; set; } = string.Empty;
    public string? MaterialName { get; set; }
    public string? Gsm { get; set; }
    public string DefaultColourHex { get; set; } = string.Empty;
    public string DefaultColourName { get; set; } = "Default";
    public string DefaultColourPantone { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
}

public class ProductDto
{
    public Guid Id { get; set; }
    public string ProductType { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string? SleeveLength { get; set; }
    public string? ProductLengthDesc { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<MaterialLayerDto> MaterialLayers { get; set; } = new();
}
