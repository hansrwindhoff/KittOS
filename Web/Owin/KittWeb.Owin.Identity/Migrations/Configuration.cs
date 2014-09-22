namespace KittWeb.Owin.Identity.Migrations
{
    using KittWeb.Owin.Core.Enums;
    using KittWeb.Owin.Identity.Models;
    using Microsoft.AspNet.Identity;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<KittWeb.Owin.Identity.Models.AuthorizationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(KittWeb.Owin.Identity.Models.AuthorizationDbContext context)
        {
            var adminUser = new AuthorizationUser("Admin") {
                Id = Guid.NewGuid().ToString("N"),
                PasswordHash = new PasswordHasher().HashPassword("password123!"),
                SecurityStamp = Guid.NewGuid().ToString(),
                Email = "email@example.com",
                EmailConfirmed = true,
            };

            // Add dummy admin account
            context.Users.AddOrUpdate(user => user.UserName, adminUser);

            // Add dummy client to admin account
            context.Clients.AddOrUpdate(client => client.UserId, new AuthorizationClient {
                Id = "ABC123",
                UserId = adminUser.Id,
                Name = "Demo Resource Owner Password Credentials Grant Client",
                SecretHash = new PasswordHasher().HashPassword("client123!"),
                AllowedGrant = OAuthGrant.ResourceOwner,
                CreatedOn = DateTimeOffset.UtcNow
            });
        }
    }
}
