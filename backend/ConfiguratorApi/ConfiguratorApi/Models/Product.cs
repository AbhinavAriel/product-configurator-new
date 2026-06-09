using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConfiguratorApi.Models;

[Table("products")]
public class Product
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    [Column("product_type")]
    public string ProductType { get; set; } = string.Empty; // tshirt | bag | mobilecase | shorts

    [Required]
    [MaxLength(200)]
    [Column("product_name")]
    public string ProductName { get; set; } = string.Empty;

    [MaxLength(100)]
    [Column("sleeve_length")]
    public string? SleeveLength { get; set; }

    [MaxLength(200)]
    [Column("product_length_desc")]
    public string? ProductLengthDesc { get; set; }

    [Column("description")]
    public string? Description { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<MaterialLayer> MaterialLayers { get; set; } = new List<MaterialLayer>();
    public ICollection<SavedConfiguration> SavedConfigurations { get; set; } = new List<SavedConfiguration>();
}
