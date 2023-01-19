using System.Diagnostics;

namespace Daw2022.Juegos.Mastermind.RestServer.HostedServices;

internal abstract class PeriodicService : IHostedService, IDisposable
{
    private Timer? _timer;

    private TimeSpan _intervarlo;

    public PeriodicService(TimeSpan intervalo)
    {
        _intervarlo = intervalo;
    }

    public TimeSpan Intervalo
    {
        get => _intervarlo;
        set
        {
            // hay cambios?
            if (_intervarlo == value) return;

            // es negativo el intervalo?
            if (value.Ticks < 0) throw new ArgumentOutOfRangeException(nameof(Intervalo));

            _intervarlo = value;

            // modificar el temporizador?
            if (_timer == null) return;

            _timer.Dispose();
            _timer = null;
            CrearTemporizador();
        }
    }

    #region Implementación de IHostedService
    public Task StartAsync(CancellationToken stoppingToken)
    {
        CrearTemporizador();

        return Task.CompletedTask;
    } // StartAsync

    public Task StopAsync(CancellationToken stoppingToken)
    {
        // paramos el temporizador
        _timer?.Change(Timeout.Infinite, 0);

        return Task.CompletedTask;
    } // StopAsync

    #endregion

    #region Implementación de IDisposable

    public void Dispose()
    {
        if (_timer == null) return;

        _timer.Dispose();
        _timer = null;
    } // Dispose

    #endregion

    protected abstract void RealizarTareaPeriodica();

    private void CrearTemporizador()
    {
        Debug.Assert(_timer == null);
        _timer = new Timer(InvocarTareaPeriodica, null, TimeSpan.Zero, _intervarlo);
    } // CrearTemporizador

    private void InvocarTareaPeriodica(object? datos) => RealizarTareaPeriodica();
} // PeriodicService