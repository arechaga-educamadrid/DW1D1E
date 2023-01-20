namespace Daw2022.Juegos.Mastermind.RestServer.Services;

public interface ISimulacionLatencia
{
    bool Habilitado { get; set; }
    void Simular();
} // interface ISimulacionLatencia
