using System.ComponentModel.DataAnnotations;

namespace Daw2022.Juegos.Mastermind.RestServer.Models;

public class Jugada
{
    [Required]
    public int[]? Numeros { get; set; }
} // class Jugada