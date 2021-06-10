using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Mineswe.io.WebApi.Hubs
{
    public class TestHub : Hub<string>
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine("OnConnected");

            return base.OnConnectedAsync();
        }

        [HubMethodName("TestMethod")]
        public void TestMethod(string str)
        {
            Console.WriteLine(str);
        }
    }
}