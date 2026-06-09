using System.ComponentModel.DataAnnotations;

namespace ConfiguratorApi.DTOs;

public class UpdateMaterialLayerRequest
{
    public Guid? Id { get; set; } // null = new layer

    [Required]
    [MaxLength(100)]
    public string LayerName { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? MaterialName { get; set; }

    [MaxLength(50)]
    public string? Gsm { get; set; }

    [MaxLength(20)]
    public string DefaultColourHex { get; set; } = string.Empty;

    [MaxLength(50)]
    public string DefaultColourName { get; set; } = "Default";

    [MaxLength(50)]
    public string DefaultColourPantone { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;
}

public class UpdateProductRequest
{
    [MaxLength(200)]
    public string? ProductName { get; set; }

    [MaxLength(100)]
    public string? SleeveLength { get; set; }

    [MaxLength(200)]
    public string? ProductLengthDesc { get; set; }

    public string? Description { get; set; }

    public bool? IsActive { get; set; }

    /// <summary>
    /// If provided, replaces the product's material layers entirely.
    /// If null/omitted, layers are not changed.
    /// </summary>
    public List<UpdateMaterialLayerRequest>? MaterialLayers { get; set; }
}
