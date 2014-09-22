namespace KittOS.Controllers
{
    using KittOS.Models;
    using KittWeb.Owin.Identity;
    using KittWeb.Owin.Identity.Models;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.Cookies;
    using System.Net.Http;
    using System.Threading.Tasks;
    using System.Web.Http;

    public class AccountController : ApiController
    {
        private AuthorizationUserManager m_userManager;

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }
        public AuthorizationUserManager UserManager {
            get {
                return m_userManager ?? Request.GetOwinContext().GetUserManager<AuthorizationUserManager>();
            }
            private set {
                m_userManager = value;
            }
        }

        public AccountController() {
        }

        public AccountController(AuthorizationUserManager userManager, ISecureDataFormat<AuthenticationTicket> accessTokenFormat) {
            AccessTokenFormat = accessTokenFormat;
            UserManager = userManager;
        }

        protected override void Dispose(bool disposing) {
            if (disposing) {
                UserManager.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Helpers
        private IAuthenticationManager Authentication {
            get { return Request.GetOwinContext().Authentication; }
        }
        private IHttpActionResult GetErrorResult(IdentityResult result) {
            if (result == null) {
                return InternalServerError();
            }

            if (!result.Succeeded) {
                if (result.Errors != null) {
                    foreach (string error in result.Errors) {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid) {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
        #endregion

        #region Actions
        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(RegisterModel model) {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var user = new AuthorizationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user, model.Password);

            if (!result.Succeeded) {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout() {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }
        #endregion
    }
}