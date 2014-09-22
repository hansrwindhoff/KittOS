namespace KittWeb.Owin.Identity
{
    using KittWeb.Owin.Core.Enums;
    using KittWeb.Owin.Identity.Models;
    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.Owin;
    using Microsoft.Owin.Security;
    using Microsoft.Owin.Security.Cookies;
    using Microsoft.Owin.Security.OAuth;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Security.Claims;
    using System.Threading.Tasks;

    public class AuthorizationOAuthProvider : OAuthAuthorizationServerProvider
    {
        private readonly string _publicClientId;

        public AuthorizationOAuthProvider(string publicClientId) {
            if (publicClientId == null) {
                throw new ArgumentNullException("publicClientId");
            }

            _publicClientId = publicClientId;
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context) {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary) {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context) {
            var userManager = context.OwinContext.GetUserManager<AuthorizationUserManager>();
            var user = await userManager.FindAsync(context.UserName, context.Password);

            if (user == null) {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }

            var oAuthIdentity = await user.GenerateUserIdentityAsync(userManager, OAuthDefaults.AuthenticationType);
            var cookiesIdentity = await user.GenerateUserIdentityAsync(userManager, CookieAuthenticationDefaults.AuthenticationType);

            AuthenticationProperties properties = CreateProperties(user.UserName);
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
            context.Validated(ticket);
            context.Request.Context.Authentication.SignIn(cookiesIdentity);
        }
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context) {
            string clientId;
            string clientSecret;

            if (context.TryGetBasicCredentials(out clientId, out clientSecret)) {
                var userManager = context.OwinContext.GetUserManager<AuthorizationUserManager>();
                var dbContext = context.OwinContext.Get<AuthorizationDbContext>();

                try {
                    var client = await dbContext.Clients.FirstOrDefaultAsync(clientEntity => clientEntity.Id == clientId);

                    if (client != null &&
                        userManager.PasswordHasher.VerifyHashedPassword(client.SecretHash, clientSecret) == PasswordVerificationResult.Success) {
                        // Client has been verified.
                        context.OwinContext.Set<AuthorizationClient>("oauth:client", client);
                        context.Validated(clientId);
                    } else {
                        // Client could not be validated.
                        context.SetError("invalid_client", "Client credentials are invalid.");
                        context.Rejected();
                    }
                } catch {
                    // Could not get the client through the IClientManager implementation.
                    context.SetError("server_error");
                    context.Rejected();
                }
            } else {
                // The client credentials could not be retrieved.
                context.SetError(
                    "invalid_client",
                    "Client credentials could not be retrieved through the Authorization header.");

                context.Rejected();
            }
        }
        public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context) {
            var client = context.OwinContext.Get<AuthorizationClient>("oauth:client");

            if (client != null && client.RedirectUri == context.RedirectUri) {
                context.Validated();
            }

            return Task.FromResult<object>(null);
        }

        public static AuthenticationProperties CreateProperties(string userName) {
            IDictionary<string, string> data = new Dictionary<string, string> {
                { "userName", userName }
            };
            return new AuthenticationProperties(data);
        }
    }
}