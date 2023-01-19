namespace Daw2022.Juegos.Mastermind.RestServer.Models;

public class Juego : ConfiguracionJuego
{
    public Juego()
    {
        // en blanco
    } // constructor

    public Juego(ConfiguracionJuego configuracion)
    {
        Minimo = configuracion.Minimo;
        Maximo = configuracion.Maximo;
        Casillas = configuracion.Casillas;

        ExtenderCaducidad();
    } // constructor

    public static int ExtensionCaducidadSegundosDefecto { get; set; } = 5 * 60; // 5 minutos
    public static int ExtensionCaducidadSegundosGanador { get; set; } = 1 * 60; // 1 minuto

    public Guid Identificador { get; set; }

    public int NumeroJugada { get; set; }

    public bool EsGanador { get; set; }

    public int[] Numeros { get; set; } = Array.Empty<int>();

    public DateTime? Caducidad { get; set; }

    public void ExtenderCaducidad() => ExtenderCaducidad(TimeSpan.FromSeconds(ExtensionCaducidadSegundosDefecto));

    public void CaducarGanador()
    {
        if (!EsGanador) throw new InvalidOperationException();

        ExtenderCaducidad(TimeSpan.FromSeconds(ExtensionCaducidadSegundosGanador));
    } // if

    public void Caducar() => ExtenderCaducidad(TimeSpan.FromSeconds(-1));

    public void ExtenderCaducidad(TimeSpan tiempoAdicional)
    {
        Caducidad = DateTime.UtcNow + tiempoAdicional;
    } // ExtenderCaducidad
} // class Juego