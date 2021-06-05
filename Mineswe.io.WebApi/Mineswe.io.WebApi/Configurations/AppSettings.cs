using System;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Mineswe.io.WebApi.Configurations
{
    public class AppSettings
    {
        public string Secret { get; set; }
        public string DefaultUserName { get; set; }
        public string DefaultUserEmail { get; set; }
        public string DefaultUserPasswordHash { get; set; }
    }

    public static class AppVersionInfo
    {
        public static readonly string AppName = "Mineswe.IO.WebAPI";

        public static readonly string BuildVersion = "v0.0.1";

        public static readonly OpenApiInfo OpenApiInfo = new OpenApiInfo
        {
            Version = BuildVersion,
            Title = "Mineswe.io API"
        };
    }

    public static class AppJwtInfo
    {

    }
}