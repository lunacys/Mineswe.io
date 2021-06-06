using Newtonsoft.Json;

namespace Mineswe.io.WebApi.Models
{
    public class ErrorResponse
    {
        [JsonRequired]
        public string Error { get; set; }
    }
}