using System.IO;
using System.Linq;
using System.Reflection;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Mineswe.io.WebApi.Configurations.SwaggerFilters
{
    public class HideDocumentFilter : ISchemaFilter, IDocumentFilter
    {
        internal static string ToCamelCase(string value)
        {
            if (string.IsNullOrEmpty(value)) return value;
            return char.ToLowerInvariant(value[0]) + value.Substring(1);
        }

        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            if (schema.Properties.Count == 0)
                return;

            const BindingFlags bindingFlags = BindingFlags.Public |
                                              BindingFlags.NonPublic |
                                              BindingFlags.Instance;
            var memberList = context.Type
                .GetFields(bindingFlags)
                .Cast<MemberInfo>()
                .Concat(context.Type.GetProperties(bindingFlags));

            var excludedList = memberList.Where(m => m.GetCustomAttribute<SwaggerIgnoreAttribute>() != null)
                .Select(m => m.GetCustomAttribute<JsonPropertyAttribute>()?.PropertyName ?? ToCamelCase(m.Name));

            foreach (var excludedName in excludedList)
            {
                if (schema.Properties.ContainsKey(excludedName))
                    schema.Properties.Remove(excludedName);
            }
        }

        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            swaggerDoc.Components.Schemas.Remove(nameof(File));
        }
    }
}