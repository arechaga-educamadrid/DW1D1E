namespace Daw2022.MastermindServer.Models;

public class PlayerMove
{
    public Guid GameId { get ; set; }

    public int[] Numbers { get ; set; } = new int[0];
} // class PlayerMove
