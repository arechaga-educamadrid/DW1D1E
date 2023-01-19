using System.Collections.Concurrent;
using Daw2022.Juegos.Mastermind.RestServer.Models;

namespace Daw2022.Juegos.Mastermind.RestServer.Services;

internal sealed class AlmacenMemoriaMastermind : IAlmacenJuegosMastermind
{
    private ConcurrentDictionary<string, Juego> _almacen = new ConcurrentDictionary<string, Juego>();

    public IEnumerable<Guid> ObtenerIdentificadores()
    {
        foreach (var key in _almacen.Keys)
        {
            yield return Guid.Parse(key);
        } // foreach
    } // ObtenerIdentificadores

    public IEnumerable<Juego> ObtenerTodos()
    {
        return _almacen.Values;
    } // ObtenerTodos

    public Juego? Obtener(Guid identificador)
    {
        if (_almacen.TryGetValue(identificador.ToString("D"), out var valor))
        {
            return valor;
        } // if
        
        return null;
    } // Obtener

    public Guid? Anexar(Juego juego)
    {
        juego.Identificador = Guid.NewGuid();
        
        if (_almacen.TryAdd(juego.Identificador.ToString("D"), juego))
        {
            return juego.Identificador;
        } // if

        return null;
    } // Anexar

    public bool Modificar(Juego juego)
    {
        var clave = juego.Identificador.ToString("D");
        if (!_almacen.ContainsKey(clave)) return false;

        _almacen[clave] = juego;

        return true;
    } // Modificar

    public bool Eliminar(Guid identificador)
    {
        return _almacen.TryRemove(identificador.ToString("D"), out _);
    } // Eliminar
} // AlmacenMemoriaMastermind