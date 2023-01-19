using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Daw2022.Juegos.Mastermind.RestServer.Models;

public class ConfiguracionJuego : ISoportaValidacionAspNet
{
    public int Minimo { get ; set; }

    public int Maximo { get; set; }

    [Range(1, 100)]
    public int Casillas { get; set; }

    #region Implementación de ISoportaValidacionAspNet
    public void ValidarModelo(ModelStateDictionary modelState)
    {
        if (Minimo > Maximo)
        {
            modelState.TryAddModelError(nameof(Minimo), "El mínimo es mayor que el máximo");
        } // if

        var rango = (Maximo - Minimo) + 1;
        if (rango < Casillas)
        {
            modelState.TryAddModelError(nameof(Casillas), "El rango mínimo-máximo es inferior al número de casillas");
        } // if
    } // ValidarModelo
    #endregion
} // ConfiguracionJuego
