using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace ConfiguratorApi.Migrations
{
    /// <inheritdoc />
    public partial class SplitTShirts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("04aa8224-04ea-4253-a1b2-602093b036a4"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("341cbe58-16ec-4924-98de-23bac5ea410c"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("3867d044-affa-4157-9e88-218231b38917"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("3d96ccd1-31c4-44d3-a0b0-18c14098c5e0"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("7ccb9ecc-3ebf-4bf1-aefc-2356796acfb9"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("7fdec87d-c1e8-43ab-9fb7-1b6185a237ea"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("8cf2eb8e-07c5-4837-b8dc-c891320c8c0e"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("91b67656-0529-4957-bbf1-6a5de2cd9175"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("9cd56b48-f00f-487d-8a18-4ddc780d16d1"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("b081ded7-98cd-49f9-a9c8-e0a785e2b24c"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("b1ea9d36-5625-497c-8cec-0556bb6ad1cd"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("c0db4fed-e8a5-4704-9144-d4c4009daf58"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("f0eb62be-81ac-4c2c-a7a3-654f59e88e25"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("f2e7a97c-0209-4fe3-992a-3e06e43a05e5"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("fd3fb809-e2b5-4f28-bf58-a095b884e665"));

            migrationBuilder.InsertData(
                table: "material_layers",
                columns: new[] { "id", "default_colour_hex", "default_colour_name", "default_colour_pantone", "display_order", "gsm", "layer_name", "material_name", "product_id" },
                values: new object[,]
                {
                    { new Guid("086ac5df-9a39-43d9-9456-667fa97ebefc"), "", "Default", "", 3, "220-230 GSM", "Piping", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("37f1f16a-e03b-4138-a7a9-26ce8100da95"), "", "Default", "", 1, "220-230 GSM", "Zip", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("58247031-eb66-4a11-b3d8-c824754d5403"), "", "Default", "", 0, "220-230 GSM", "Bag", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("6f8f717f-0d5f-4973-8b3c-86a3ccdd98c0"), "#ffffff", "Default", "", 0, null, "Back Color", null, new Guid("11111111-0000-0000-0000-000000000003") },
                    { new Guid("6fa75cfe-c2b4-408b-9de8-e93a793e434b"), "", "Default", "", 1, null, "Detail", null, new Guid("11111111-0000-0000-0000-000000000004") },
                    { new Guid("70b0f8f2-9ad2-4aa5-8a2d-059e2035c12f"), "", "Default", "", 2, "220-230 GSM", "Collar", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("763b2b7f-4733-480b-9b15-445c7fe09587"), "", "Default", "", 0, "220-230 GSM", "Body", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("8d2e6cad-13e9-40dd-9f89-0e7abe9a4aab"), "", "Default", "", 0, null, "Body", null, new Guid("11111111-0000-0000-0000-000000000004") },
                    { new Guid("a0063d2d-7241-4d11-aed2-05daefd99795"), "", "Default", "", 2, null, "ZK Logo", null, new Guid("11111111-0000-0000-0000-000000000004") },
                    { new Guid("a451d880-8862-49ca-a326-c0443fd85087"), "", "Default", "", 2, "220-230 GSM", "Handle", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("b759283b-0bf4-4ab8-bacb-aa1000aac7d0"), "", "Default", "", 3, "220-230 GSM", "Zapkam", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("e3df1090-41f6-4d54-93dd-d1461d39e9f9"), "", "Default", "", 1, "220-230 GSM", "Set Sleeve", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") },
                    { new Guid("e7743c85-25e6-48c5-bbed-abb2b1443026"), "", "Default", "", 1, null, "Camera Box", null, new Guid("11111111-0000-0000-0000-000000000003") },
                    { new Guid("ef7310a3-b8e4-468b-b52f-2bd99d682f68"), "", "Default", "", 4, "220-230 GSM", "Mesh", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000002") },
                    { new Guid("f7bf93df-3b11-4a7d-8766-037b4a2e1188"), "", "Default", "", 4, "220-230 GSM", "Zk", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000001") }
                });

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: new Guid("11111111-0000-0000-0000-000000000001"),
                column: "product_name",
                value: "Custom Jersey (Full Sleeves)");

            migrationBuilder.InsertData(
                table: "products",
                columns: new[] { "id", "created_at", "description", "is_active", "product_length_desc", "product_name", "product_type", "sleeve_length", "updated_at" },
                values: new object[,]
                {
                    { new Guid("11111111-0000-0000-0000-000000000005"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fully customizable polyester jersey with sublimation printing.", true, "Sleeve Length", "Custom Jersey (Half Sleeves)", "tshirt", "Half Sleeves", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("11111111-0000-0000-0000-000000000006"), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Fully customizable polyester jersey with sublimation printing.", true, "Sleeve Length", "Custom Jersey (Sleeveless)", "tshirt", "Sleeveless", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "material_layers",
                columns: new[] { "id", "default_colour_hex", "default_colour_name", "default_colour_pantone", "display_order", "gsm", "layer_name", "material_name", "product_id" },
                values: new object[,]
                {
                    { new Guid("04c21c65-1833-4b82-85b1-5f466bd54add"), "", "Default", "", 2, "220-230 GSM", "Collar", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000005") },
                    { new Guid("46160f51-4261-4fd6-b119-b1ac700947fa"), "", "Default", "", 0, "220-230 GSM", "Body", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000006") },
                    { new Guid("6d1e1c41-175f-47a6-8a64-1f6da62839ac"), "", "Default", "", 1, "220-230 GSM", "Set Sleeve", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000005") },
                    { new Guid("84ea2355-ec30-4883-a4ef-2db46602031c"), "", "Default", "", 1, "220-230 GSM", "Collar", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000006") },
                    { new Guid("9bc9c855-d9a7-4f8e-a3b2-daf1d6db789b"), "", "Default", "", 0, "220-230 GSM", "Body", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000005") },
                    { new Guid("9c8d38fa-054f-44db-9156-6d9f549c0d30"), "", "Default", "", 4, "220-230 GSM", "Zk", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000005") },
                    { new Guid("a69961eb-7860-4423-b4cf-594687d7f9f7"), "", "Default", "", 3, "220-230 GSM", "Zk", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000006") },
                    { new Guid("aacf67d9-ee36-4de9-b9a2-5849fa7b6920"), "", "Default", "", 3, "220-230 GSM", "Zapkam", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000005") },
                    { new Guid("e4ef0bde-4767-47c2-b264-1801cff68cf6"), "", "Default", "", 2, "220-230 GSM", "Zapkam", "Polyester Double Interlock (Sublimation)", new Guid("11111111-0000-0000-0000-000000000006") }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("04c21c65-1833-4b82-85b1-5f466bd54add"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("086ac5df-9a39-43d9-9456-667fa97ebefc"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("37f1f16a-e03b-4138-a7a9-26ce8100da95"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("46160f51-4261-4fd6-b119-b1ac700947fa"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("58247031-eb66-4a11-b3d8-c824754d5403"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("6d1e1c41-175f-47a6-8a64-1f6da62839ac"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("6f8f717f-0d5f-4973-8b3c-86a3ccdd98c0"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("6fa75cfe-c2b4-408b-9de8-e93a793e434b"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("70b0f8f2-9ad2-4aa5-8a2d-059e2035c12f"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("763b2b7f-4733-480b-9b15-445c7fe09587"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("84ea2355-ec30-4883-a4ef-2db46602031c"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("8d2e6cad-13e9-40dd-9f89-0e7abe9a4aab"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("9bc9c855-d9a7-4f8e-a3b2-daf1d6db789b"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("9c8d38fa-054f-44db-9156-6d9f549c0d30"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("a0063d2d-7241-4d11-aed2-05daefd99795"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("a451d880-8862-49ca-a326-c0443fd85087"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("a69961eb-7860-4423-b4cf-594687d7f9f7"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("aacf67d9-ee36-4de9-b9a2-5849fa7b6920"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("b759283b-0bf4-4ab8-bacb-aa1000aac7d0"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("e3df1090-41f6-4d54-93dd-d1461d39e9f9"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("e4ef0bde-4767-47c2-b264-1801cff68cf6"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("e7743c85-25e6-48c5-bbed-abb2b1443026"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("ef7310a3-b8e4-468b-b52f-2bd99d682f68"));

            migrationBuilder.DeleteData(
                table: "material_layers",
                keyColumn: "id",
                keyValue: new Guid("f7bf93df-3b11-4a7d-8766-037b4a2e1188"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "id",
                keyValue: new Guid("11111111-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "products",
                keyColumn: "id",
                keyValue: new Guid("11111111-0000-0000-0000-000000000006"));

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

            migrationBuilder.UpdateData(
                table: "products",
                keyColumn: "id",
                keyValue: new Guid("11111111-0000-0000-0000-000000000001"),
                column: "product_name",
                value: "Custom Jersey");
        }
    }
}
