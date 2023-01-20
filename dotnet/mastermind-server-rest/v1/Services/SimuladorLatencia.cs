namespace Daw2022.Juegos.Mastermind.RestServer.Services;

public class SimuladorLatencia : ISimulacionLatencia
{
    private readonly Random _random;
    private readonly int _minimo;
    private readonly int _maximo;

    public SimuladorLatencia(IConfiguration configuracion, ILogger<ISimulacionLatencia> logger)
    {
        _random = new Random();
        _minimo = 1000;
        _maximo = 5000;

        logger.Log(LogLevel.Debug, "Creado simulador de latencia");
        var habilitado = configuracion["SimulacionLatencia:Habilitado"]?.ToLowerInvariant()?.Trim();
        if ((habilitado == null) ||
            (habilitado == "") ||
            (habilitado == "0") ||
            (habilitado == "false"))
        {
            return;
        } // if

        Habilitado = true;
        logger.Log(LogLevel.Information, "Habilitado simulador de latencia");
    }  // constructor

    public bool Habilitado { get; set; }

    public void Simular()
    {
        if (!Habilitado) return;

        var tiempo = _random.Next(_minimo, _maximo);
        if (tiempo < 0) return;

        Thread.Sleep(tiempo);
    } // Simular
} // class SimuladorLatenciaNula