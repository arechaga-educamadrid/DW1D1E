using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;

namespace Daw2022.MastermindServer.Controllers;

[ApiController]
[ApiExplorerSettings(IgnoreApi = true)]
public class WebSocketController : ControllerBase
{
    private class WsData
    {
        public WsData(WebSocket ws)
        {
            Socket = ws;
            Buffer = new byte[1024];
        } // constructor

        public WebSocket Socket { get; init; }

        public DateTime LastActivity { get; private set; } = DateTime.UtcNow;

        public bool IsTimedOut(TimeSpan span) => (DateTime.UtcNow - LastActivity) >= span;

        public Guid SessionId { get; set; }

        public void ResetTimeout() => LastActivity = DateTime.UtcNow;

        public byte[] Buffer { get; init; }
    } // class WsData

    private static LinkedList<WsData>? Sockets;
   

    [Route("/ws")]
    public async Task Get()
    {
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            using var ws = await HttpContext.WebSockets.AcceptWebSocketAsync();
            ws.ReceiveAsync(null, CancellationToken.None).Start();
            await Echo(ws);
        }
        else
        {
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }

    private static async Task Echo(WebSocket ws)
    {
        var buffer = new byte[1024 * 4];
        var receiveResult = await ws.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!receiveResult.CloseStatus.HasValue)
        {
            await ws.SendAsync(
                new ArraySegment<byte>(buffer, 0, receiveResult.Count),
                receiveResult.MessageType,
                receiveResult.EndOfMessage,
                CancellationToken.None);

            receiveResult = await ws.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
        }

        await ws.CloseAsync(
            receiveResult.CloseStatus.Value,
            receiveResult.CloseStatusDescription,
            CancellationToken.None);
    }
} // class WebSocketController