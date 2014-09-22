namespace KittWeb.Owin.Identity.Models
{
    using KittWeb.Owin.Core.Enums;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("AspNetClients")]
    public class AuthorizationClient
    {
        public string Id { get; set; }
        [Required, ForeignKey("User")]
        public string UserId { get; set; }
        public string Name { get; set; }
        public string SecretHash { get; set; }
        public string RedirectUri { get; set; }
        public OAuthGrant AllowedGrant { get; set; }
        public DateTimeOffset CreatedOn { get; set; }

        public virtual AuthorizationUser User { get; set; }
    }
}