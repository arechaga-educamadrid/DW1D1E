namespace Daw2022.MastermindServer.Models;

public class MoveResult
{
    public bool IsWinner { get ; set; }

    public string[] Status { get ; set; } = Array.Empty<string>();
} // class MoveResult
