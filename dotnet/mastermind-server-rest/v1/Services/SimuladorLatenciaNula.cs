namespace Daw2022.Juegos.Mastermind.RestServer.Services;

public class SimuladorLatenciaNula : ISimulacionLatencia
{
    public bool Habilitado { get; set; }

    public void Simular()
    {
        // no hacer nada
    } // Simular
} // class SimuladorLatenciaNula