using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConfiguratorApi.Models;

[Table("saved_configurations")]
public class SavedConfiguration
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column("product_id")]
    public Guid ProductId { get; set; }

    /// <summary>
    /// Full ProductConfig JSON blob — stored as nvarchar(max) in SQL Server
    /// </summary>
    [Required]
    [Column("config_json")]
    public string ConfigJson { get; set; } = "{}";

    [MaxLength(200)]
    [Column("name")]
    public string? Name { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    [ForeignKey("ProductId")]
    public Product? Product { get; set; }
}
