using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ConfiguratorApi.Migrations
{
    /// <inheritdoc />
    public partial class InitialSqlServerCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    product_type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    product_name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    sleeve_length = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    product_length_desc = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    is_active = table.Column<bool>(type: "bit", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updated_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "material_layers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    product_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    layer_name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    material_name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    gsm = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    default_colour_hex = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    default_colour_name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    default_colour_pantone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    display_order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_material_layers", x => x.id);
                    table.ForeignKey(
                        name: "FK_material_layers_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "saved_configurations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    product_id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    config_json = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_saved_configurations", x => x.id);
                    table.ForeignKey(
                        name: "FK_saved_configurations_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "products",
                columns: new[] { "id", "created_at", "description", "is_active", "product_length_desc", "product_name", "product_type", "sleeve_length", "updated_at" },
                values: new object[,]
                {
                    { new Guid("11111111-0000-0000-0000-000000000001"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fully customizable polyester jersey with sublimation printing.", true, "Sleeve Length", "Custom Jersey", "tshirt", "Full Sleeves", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("11111111-0000-0000-0000-000000000002"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Customizable sports bag with multiple printable panels.", true, null, "Custom Bag", "bag", null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("11111111-0000-0000-0000-000000000003"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Premium mobile case with pattern and color customization.", true, null, "Impact Cover Pro", "mobilecase", null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("11111111-0000-0000-0000-000000000004"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Customizable sports shorts with body and detail layer coloring.", true, null, "Custom Shorts", "shorts", null, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "material_layers",
                columns: new[] { "id", "default_colour_hex", "default_colour_name", "default_colour_pantone", "display_order", "gsm", "layer_name", "material_name", "product_id" },
                values: new object[,]
                {
                    { new Guid("04aa8224-04ea-4253-a1b2-602093b036a4"), "", "Default", "", 0, "220-230 GSM", "Bag", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("341cbe58-16ec-4924-98de-23bac5ea410c"), "", "Default", "", 3, "220-230 GSM", "Zapkam", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("3867d044-affa-4157-9e88-218231b38917"), "", "Default", "", 2, "220-230 GSM", "Collar", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("3d96ccd1-31c4-44d3-a0b0-18c14098c5e0"), "", "Default", "", 4, "220-230 GSM", "Mesh", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("7ccb9ecc-3ebf-4bf1-aefc-2356796acfb9"), "", "Default", "", 0, "220-230 GSM", "Body", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("7fdec87d-c1e8-43ab-9fb7-1b6185a237ea"), "", "Default", "", 3, "220-230 GSM", "Piping", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("8cf2eb8e-07c5-4837-b8dc-c891320c8c0e"), "", "Default", "", 4, "220-230 GSM", "Zk", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("91b67656-0529-4957-bbf1-6a5de2cd9175"), "", "Default", "", 1, null, "Camera Box", null, new Guid("11111111-0000-0000-0000-000000000003") },
                    { new Guid("9cd56b48-f00f-487d-8a18-4ddc780d16d1"), "#ffffff", "Default", "", 0, null, "Back Color", null, new Guid("11111111-0000-0000-0000-000000000003") },
                    { new Guid("b081ded7-98cd-49f9-a9c8-e0a785e2b24c"), "", "Default", "", 2, null, "ZK Logo", null, new Guid("11111111-0000-0000-0000-000000000004") },
                    { new Guid("b1ea9d36-5625-497c-8cec-0556bb6ad1cd"), "", "Default", "", 1, "220-230 GSM", "Zip", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("c0db4fed-e8a5-4704-9144-d4c4009daf58"), "", "Default", "", 1, null, "Detail", null, new Guid("11111111-0000-0000-0000-000000000004") },
                    { new Guid("f0eb62be-81ac-4c2c-a7a3-654f59e88e25"), "", "Default", "", 1, "220-230 GSM", "Set Sleeve", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("f2e7a97c-0209-4fe3-992a-3e06e43a05e5"), "", "Default", "", 0, null, "Body", null, new Guid("11111111-0000-0000-0000-000000000004") },
                    { new Guid("fd3fb809-e2b5-4f28-bf58-a095b884e665"), "", "Default", "", 2, "220-230 GSM", "Handle", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") }
                });

            migrationBuilder.CreateIndex(
                name: "IX_material_layers_product_id",
                table: "material_layers",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_products_is_active",
                table: "products",
                column: "is_active");

            migrationBuilder.CreateIndex(
                name: "IX_products_product_type",
                table: "products",
                column: "product_type");

            migrationBuilder.CreateIndex(
                name: "IX_saved_configurations_product_id",
                table: "saved_configurations",
                column: "product_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "material_layers");

            migrationBuilder.DropTable(
                name: "saved_configurations");

            migrationBuilder.DropTable(
                name: "products");
        }
    }
}
