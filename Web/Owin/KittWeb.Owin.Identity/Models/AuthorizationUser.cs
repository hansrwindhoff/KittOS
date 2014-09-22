namespace KittWeb.Owin.Identity.Models
{
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using System;
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Threading.Tasks;

    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class AuthorizationUser : IdentityUser
    {
        public AuthorizationUser()
            : base() {
            Clients = new HashSet<AuthorizationClient>();
        }

        public ISet<AuthorizationClient> Clients { get; set; }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<AuthorizationUser> manager, string authenticationType) {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }
}