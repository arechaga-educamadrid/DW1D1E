using Daw2022.Juegos.Mastermind.RestServer.Services;

namespace Daw2022.Juegos.Mastermind.RestServer.HostedServices;

internal class MastermindHousekeepingService : PeriodicService
{
    private readonly ILogger<MastermindHousekeepingService> _logger;
    private readonly IAlmacenJuegosMastermind _almacen;

    public MastermindHousekeepingService(ILogger<MastermindHousekeepingService> logger, IAlmacenJuegosMastermind almacen) : base(TimeSpan.FromMinutes(2))
    {
        _logger = logger;
        _almacen = almacen;
    } // constructor

    protected override void RealizarTareaPeriodica()
    {
        try
        {
            var ahora = DateTime.UtcNow;
            _logger.LogDebug($"Invocado {ahora:o}");

            foreach (var juego in _almacen.ObtenerTodos())
            {
                if ((juego.Caducidad == null) || (juego.Caducidad.Value <= ahora))
                {
                    _logger.LogDebug($"Eliminando juego caducado. {juego.Identificador} {juego.Caducidad:o} ");
                    _almacen.Eliminar(juego.Identificador);
                } // if
            } // foreach
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "excepcion");
        } // try-catch
    } // RealizarTareaPeriodica
} // class MastermindHousekeepingService