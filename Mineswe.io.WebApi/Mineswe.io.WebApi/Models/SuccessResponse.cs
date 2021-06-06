using Newtonsoft.Json;

namespace Mineswe.io.WebApi.Models
{
    public class SuccessResponse
    {
        [JsonRequired] public string Message { get; set; } = "Success";
    }
}