namespace KittWeb.Owin.Identity
{
    using KittWeb.Owin.Identity.Models;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin;
    using Microsoft.Owin.Security;
    using System.Security.Claims;
    using System.Threading.Tasks;

    public class AuthorizationSignInManager : SignInManager<AuthorizationUser, string>
    {
        public AuthorizationSignInManager(AuthorizationUserManager userManager, IAuthenticationManager authenticationManager) : base(userManager, authenticationManager) { }

        public override Task<ClaimsIdentity> CreateUserIdentityAsync(AuthorizationUser user) {
            return user.GenerateUserIdentityAsync((AuthorizationUserManager)UserManager, DefaultAuthenticationTypes.ApplicationCookie);
        }

        public static AuthorizationSignInManager Create(IdentityFactoryOptions<AuthorizationSignInManager> options, IOwinContext context) {
            return new AuthorizationSignInManager(context.GetUserManager<AuthorizationUserManager>(), context.Authentication);
        }
    }
}