namespace KittWeb.Owin.Identity
{
    using KittWeb.Owin.Identity.Models;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin;
    using System;

    public class AuthorizationUserManager : UserManager<AuthorizationUser>
    {
        public AuthorizationUserManager(IUserStore<AuthorizationUser> store) : base(store) { }

        public static AuthorizationUserManager Create(IdentityFactoryOptions<AuthorizationUserManager> options, IOwinContext context) {
            var manager = new AuthorizationUserManager(new UserStore<AuthorizationUser>(context.Get<AuthorizationDbContext>()));

            // Configure validation logic for usernames
            manager.UserValidator = new UserValidator<AuthorizationUser>(manager) {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };

            // Configure validation logic for passwords
            manager.PasswordValidator = new PasswordValidator {
                RequiredLength = 6,
                RequireNonLetterOrDigit = true,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };

            // Configure user lockout defaults
            manager.UserLockoutEnabledByDefault = true;
            manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            manager.MaxFailedAccessAttemptsBeforeLockout = 5;

            return manager;
        }
    }
}