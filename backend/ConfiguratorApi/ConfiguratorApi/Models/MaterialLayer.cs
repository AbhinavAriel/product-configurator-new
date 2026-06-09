using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConfiguratorApi.Models;

[Table("material_layers")]
public class MaterialLayer
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("product_id")]
    public Guid ProductId { get; set; }

    [Required]
    [MaxLength(100)]
    [Column("layer_name")]
    public string LayerName { get; set; } = string.Empty;

    [MaxLength(200)]
    [Column("material_name")]
    public string? MaterialName { get; set; }

    [MaxLength(50)]
    [Column("gsm")]
    public string? Gsm { get; set; }

    [MaxLength(20)]
    [Column("default_colour_hex")]
    public string DefaultColourHex { get; set; } = string.Empty;

    [MaxLength(50)]
    [Column("default_colour_name")]
    public string DefaultColourName { get; set; } = "Default";

    [MaxLength(50)]
    [Column("default_colour_pantone")]
    public string DefaultColourPantone { get; set; } = string.Empty;

    [Column("display_order")]
    public int DisplayOrder { get; set; } = 0;

    // Navigation
    [ForeignKey("ProductId")]
    public Product? Product { get; set; }
}
