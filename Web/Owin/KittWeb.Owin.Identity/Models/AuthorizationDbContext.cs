namespace KittWeb.Owin.Identity.Models
{
    using Microsoft.AspNet.Identity.EntityFramework;
    using System.Data.Entity;

    public class AuthorizationDbContext : IdentityDbContext<AuthorizationUser>
    {

        public AuthorizationDbContext() : base("DefaultConnection", throwIfV1Schema: false) { }

        static AuthorizationDbContext() {
            Database.SetInitializer(new CreateDatabaseIfNotExists<AuthorizationDbContext>());
        }

        public DbSet<AuthorizationClient> Clients { get; set; }

        public static AuthorizationDbContext Create() {
            return new AuthorizationDbContext();
        }
    }
}