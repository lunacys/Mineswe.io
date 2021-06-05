using System;

namespace Mineswe.io.WebApi.Configurations
{
    [AttributeUsage(AttributeTargets.All)]
    public sealed class SwaggerIgnoreAttribute : Attribute
    {
        public SwaggerIgnoreAttribute()
        { }
    }
}