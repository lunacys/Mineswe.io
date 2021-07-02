using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Mineswe.io.WebApi.Hubs
{
    public class TestHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            Console.WriteLine("OnConnected");

            return base.OnConnectedAsync();
        }

        [Auth]
        [Authorize(Roles = "Developer,Administrator")]
        [HubMethodName("TestMethod")]
        public async Task TestMethod(string str)
        {
            Console.WriteLine(str);
            await Clients.All.SendCoreAsync("testMethodClient", new object[] {$"hello, my boy (you said '{str} btw')"});
        }
    }
}