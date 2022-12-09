using Daw2022.MastermindServer.Models;
using Microsoft.AspNetCore.Mvc;

namespace Daw2022.MastermindServer.Controllers;

[ApiController]
[Route("v1/mastermind/game")]
public class GameController : ControllerBase
{
    [HttpPost("new")]
    public Guid New(GameSettings settings)
    {
        return Guid.NewGuid();
    } // New

    [HttpPost("play")]
    public MoveResult Play(PlayerMove move)
    {
        var result = new MoveResult();
        result.Status = new string[move.Numbers.Length];
        Array.Fill(result.Status, "fail");

        return result;
    } // Play

    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new string[] { "1", "2" };
    } // Get
} // class GameController