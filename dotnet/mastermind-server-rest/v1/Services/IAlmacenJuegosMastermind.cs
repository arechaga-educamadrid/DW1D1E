using Daw2022.Juegos.Mastermind.RestServer.Models;

namespace Daw2022.Juegos.Mastermind.RestServer.Services;

public interface IAlmacenJuegosMastermind
{
    IEnumerable<Guid> ObtenerIdentificadores();

    IEnumerable<Juego> ObtenerTodos();

    Juego? Obtener(Guid identificador);

    Guid? Anexar(Juego juego);

    bool Modificar(Juego juego);

    bool Eliminar(Guid identificador);
} // interface IAlmacenJuegosMastermind