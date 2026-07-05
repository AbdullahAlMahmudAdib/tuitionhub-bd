using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TuitionHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUserDocumentsNav : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "documents",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_documents_UserId1",
                table: "documents",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_documents_users_UserId1",
                table: "documents",
                column: "UserId1",
                principalTable: "users",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_documents_users_UserId1",
                table: "documents");

            migrationBuilder.DropIndex(
                name: "IX_documents_UserId1",
                table: "documents");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "documents");
        }
    }
}
