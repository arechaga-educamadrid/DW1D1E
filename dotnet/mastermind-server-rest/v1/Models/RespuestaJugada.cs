namespace Daw2022.Juegos.Mastermind.RestServer.Models;

public class RespuestaJugada
{
    public int NumeroJugada { get ; set; }

    public IEnumerable<string>? Resultado { get ; set; }

    public bool EsGanador { get; set; }

    public DateTime? Caducidad { get ; set; }
} // RespuestaJugada