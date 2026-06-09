using ConfiguratorApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ConfiguratorApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<MaterialLayer> MaterialLayers => Set<MaterialLayer>();
    public DbSet<SavedConfiguration> SavedConfigurations => Set<SavedConfiguration>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ─── Product ─────────────────────────────────────────────────────────
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(p => p.Id);
            entity.HasIndex(p => p.ProductType);
            entity.HasIndex(p => p.IsActive);

            entity.HasMany(p => p.MaterialLayers)
                  .WithOne(m => m.Product)
                  .HasForeignKey(m => m.ProductId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(p => p.SavedConfigurations)
                  .WithOne(c => c.Product)
                  .HasForeignKey(c => c.ProductId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ─── MaterialLayer ────────────────────────────────────────────────────
        modelBuilder.Entity<MaterialLayer>(entity =>
        {
            entity.HasKey(m => m.Id);
            entity.HasIndex(m => m.ProductId);
        });

        // ─── SavedConfiguration ───────────────────────────────────────────────
        modelBuilder.Entity<SavedConfiguration>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.ConfigJson).HasColumnType("nvarchar(max)");
        });

        // ─── Seed Data ────────────────────────────────────────────────────────
        SeedProducts(modelBuilder);
    }

    private static void SeedProducts(ModelBuilder modelBuilder)
    {
        // Fixed GUIDs so re-running migrations doesn't duplicate seed
        var tshirtFullId   = Guid.Parse("11111111-0000-0000-0000-000000000001");
        var bagId          = Guid.Parse("11111111-0000-0000-0000-000000000002");
        var mobileId       = Guid.Parse("11111111-0000-0000-0000-000000000003");
        var shortsId       = Guid.Parse("11111111-0000-0000-0000-000000000004");
        var tshirtHalfId   = Guid.Parse("11111111-0000-0000-0000-000000000005");
        var tshirtSleevlessId = Guid.Parse("11111111-0000-0000-0000-000000000006");

        var now = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        // ── Products ──────────────────────────────────────────────────────────
        modelBuilder.Entity<Product>().HasData(
            new Product
            {
                Id = tshirtFullId, ProductType = "tshirt",
                ProductName = "Custom Jersey (Full Sleeves)", SleeveLength = "Full Sleeves",
                ProductLengthDesc = "Sleeve Length",
                Description = "Fully customizable polyester jersey with sublimation printing.",
                IsActive = true, CreatedAt = now, UpdatedAt = now
            },
            new Product
            {
                Id = tshirtHalfId, ProductType = "tshirt",
                ProductName = "Custom Jersey (Half Sleeves)", SleeveLength = "Half Sleeves",
                ProductLengthDesc = "Sleeve Length",
                Description = "Fully customizable polyester jersey with sublimation printing.",
                IsActive = true, CreatedAt = now, UpdatedAt = now
            },
            new Product
            {
                Id = tshirtSleevlessId, ProductType = "tshirt",
                ProductName = "Custom Jersey (Sleeveless)", SleeveLength = "Sleeveless",
                ProductLengthDesc = "Sleeve Length",
                Description = "Fully customizable polyester jersey with sublimation printing.",
                IsActive = true, CreatedAt = now, UpdatedAt = now
            },
            new Product
            {
                Id = bagId, ProductType = "bag",
                ProductName = "Custom Bag",
                Description = "Customizable sports bag with multiple printable panels.",
                IsActive = true, CreatedAt = now, UpdatedAt = now
            },
            new Product
            {
                Id = mobileId, ProductType = "mobilecase",
                ProductName = "Impact Cover Pro",
                Description = "Premium mobile case with pattern and color customization.",
                IsActive = true, CreatedAt = now, UpdatedAt = now
            },
            new Product
            {
                Id = shortsId, ProductType = "shorts",
                ProductName = "Custom Shorts",
                Description = "Customizable sports shorts with body and detail layer coloring.",
                IsActive = true, CreatedAt = now, UpdatedAt = now
            }
        );

        // ── Material Layers ───────────────────────────────────────────────────
        var polyMaterial = "Polyester Double Interlock (Sublimation)";
        var polyGsm = "220-230 GSM";

        modelBuilder.Entity<MaterialLayer>().HasData(
            // Full Sleeves T-Shirt layers
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtFullId, LayerName = "Body",        MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 0 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtFullId, LayerName = "Set Sleeve",  MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 1 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtFullId, LayerName = "Collar",      MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 2 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtFullId, LayerName = "Zapkam",      MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 3 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtFullId, LayerName = "Zk",          MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 4 },

            // Half Sleeves T-Shirt layers
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtHalfId, LayerName = "Body",        MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 0 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtHalfId, LayerName = "Set Sleeve",  MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 1 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtHalfId, LayerName = "Collar",      MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 2 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtHalfId, LayerName = "Zapkam",      MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 3 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtHalfId, LayerName = "Zk",          MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 4 },

            // Sleeveless T-Shirt layers (no "Set Sleeve")
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtSleevlessId, LayerName = "Body",        MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 0 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtSleevlessId, LayerName = "Collar",      MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 1 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtSleevlessId, LayerName = "Zapkam",      MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 2 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = tshirtSleevlessId, LayerName = "Zk",          MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 3 },

            // Bag layers
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = bagId, LayerName = "Bag",    MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 0 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = bagId, LayerName = "Zip",    MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 1 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = bagId, LayerName = "Handle", MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 2 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = bagId, LayerName = "Piping", MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 3 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = bagId, LayerName = "Mesh",   MaterialName = polyMaterial, Gsm = polyGsm, DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 4 },

            // Mobile Case layers
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = mobileId, LayerName = "Back Color",  DefaultColourHex = "#ffffff", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 0 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = mobileId, LayerName = "Camera Box",  DefaultColourHex = "",        DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 1 },

            // Shorts layers
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = shortsId, LayerName = "Body",    DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 0 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = shortsId, LayerName = "Detail",  DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 1 },
            new MaterialLayer { Id = Guid.NewGuid(), ProductId = shortsId, LayerName = "ZK Logo", DefaultColourHex = "", DefaultColourName = "Default", DefaultColourPantone = "", DisplayOrder = 2 }
        );
    }
}
