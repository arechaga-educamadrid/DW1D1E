using System.Diagnostics;
using Daw2022.Juegos.Mastermind.RestServer.Models;
using Daw2022.Juegos.Mastermind.RestServer.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Daw2022.Juegos.Mastermind.RestServer.Controllers;

[ApiController]
[Route("/v1/mastermind")]
[EnableCors("PermitirTodo")]
public sealed class MastermindController : ControllerBase
{
    private readonly IAlmacenJuegosMastermind _almacen;

    public MastermindController(IAlmacenJuegosMastermind almacen)
    {
        _almacen = almacen;
    } // constructor

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IEnumerable<Guid> ObtenerListaIdentificadores()
    {
        return _almacen.ObtenerIdentificadores();
    } // ObtenerListaIdentificadores

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<Juego> ObtenerJuego(Guid id)
    {
        var juego = _almacen.Obtener(id);
        if (juego == null)
        {
            return NotFound();
        } // if

        return juego;
    } // ObtenerJuego

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public ActionResult<Guid> NuevoJuego(ConfiguracionJuego configuracion)
    {
        // validación de la configuración
        // hay formas de hacerlo automático, pero para no complicar aún más el código lo hacemos manualmente
        if (configuracion is ISoportaValidacionAspNet modelo)
        {
            modelo.ValidarModelo(ModelState);
        } // if

        // superamos la validación?
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        } // if

        var juego = CrearNuevoJuego(configuracion);
        juego.ExtenderCaducidad();

        // guardamos el juego en el almacén
        var id = _almacen.Anexar(juego);
        if (id == null)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        } // if

        // indicamos éxito
        return CreatedAtAction(nameof(ObtenerJuego), new { id = id.Value }, id.Value);
    } // NuevoJuego

    [HttpPost("{id}/jugada")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public ActionResult<RespuestaJugada> RealizarJugada(Guid id, Jugada jugada)
    {
        var juego = _almacen.Obtener(id);
        if (juego == null)
        {
            return NotFound();
        } // if

        // ha terminado la partida?
        if (juego.EsGanador)
        {
            ModelState.TryAddModelError(nameof(jugada), "La partida se ha terminado. No se puede seguir jugando");
            return ValidationProblem(ModelState);
        } // if

        // validación de los datos de la jugada
        ValidarDatosJugada(jugada, juego, ModelState);

        // superamos la validación?
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        } // if

        // incrementamos la caducidad del juego
        juego.ExtenderCaducidad();

        // "realizamos" la jugada
        juego.NumeroJugada++;
        var respuesta = new RespuestaJugada()
        {
            NumeroJugada = juego.NumeroJugada,
            Caducidad = juego.Caducidad,
            Resultado = ComprobarJugada(jugada, juego, out var esGanador),
            EsGanador = esGanador,
        };

        // hemos ganado?
        if (esGanador)
        {
            juego.EsGanador = esGanador;
            // marcar para retirada "inmediata"
            juego.CaducarGanador();
        } // if

        // guardamos los cambios del juego en el almacén
        _almacen.Modificar(juego);

        return respuesta;
    } // RealizarJugada

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Eliminar(Guid id)
    {
        var eliminado = _almacen.Eliminar(id);

        return eliminado ? Ok() : NotFound();
    } // Eliminar

    #region Implementación del juego en sí mismo
    private const int NumeroMaximoCasillas = 100;

    // Todo este código debiera ir en una clase estática aparte
    // para que la implementación del controlador sea "más limpia".
    // Se deja como ejercicio para el lector.

    private static Juego CrearNuevoJuego(ConfiguracionJuego configuracion)
    {
        var juego = new Juego(configuracion)
        {
            Numeros = CrearNumerosAleatorios(new Random(), configuracion),
        };

        return juego;
    } // CrearNuevoJuego

    private static int ObtenerNumeroAleatorio(Random random, ConfiguracionJuego configuracion)
    {
        // random.Next no incluye el valor final; por eso sumamos + 1
        return random.Next(configuracion.Minimo, configuracion.Maximo + 1);
    } // CrearNumeroAleatorio

    private static int[] CrearNumerosAleatorios(Random random, ConfiguracionJuego configuracion)
    {
        var casillas = configuracion.Casillas;
        var numeros = new int[casillas];

        for (int i = 0; i < casillas; i++)
        {
            bool repetido;
            int numero;

            do
            {
                numero = ObtenerNumeroAleatorio(random, configuracion);

                // comprobamos si está repetido
                repetido = false;
                for (int j=0 ; j<i ; j++)
                {
                    if (numero == numeros[j]) {
                        repetido = true;
                        break;
                    } // if
                } // for j
            } while (repetido);

            // guardamos el número (que seguro que no está repetido)
            numeros[i] = numero;
        } // for i

        return numeros;
    } // CrearNumerosAleatorios

    private static void ValidarDatosJugada(Jugada jugada, Juego juego, ModelStateDictionary modelState)
    {
        if (jugada.Numeros == null)
        {
            modelState.TryAddModelError(nameof(jugada.Numeros), "No se ha especificado ningún valor");
            return;
        } // if

        if (jugada.Numeros.Length != juego.Casillas)
        {
            modelState.TryAddModelError(nameof(jugada.Numeros), $"La longitud del array es incorrecta. Se esperaba {juego.Casillas}");
            return;
        } // if
    } // ValidarDatosJugada

    private static string[] ComprobarJugada(Jugada jugada, Juego juego, out bool esGanador)
    {
        Debug.Assert(!(jugada.Numeros == null));
        Debug.Assert(jugada.Numeros.Length == juego.Numeros.Length);

        var resultado = new string[juego.Numeros.Length];
        var coincidencias = 0;
        for (int i=0 ; i<juego.Numeros.Length ; i++)
        {
            var numero = jugada.Numeros[i];
            // fuera de rango?
            if ((numero < juego.Minimo) || (numero > juego.Maximo))
            {
                resultado[i] = "error";
                continue;
            } // if

            // coincidencia?
            if (numero == juego.Numeros[i])
            {
                resultado[i] = "acierto";
                coincidencias++;
                continue;
            } // if

            // asumimos fallo
            resultado[i] = "fallo";

            // coincidencia parcial?
            for (int j=0 ; j<juego.Numeros.Length ; j++)
            {
                if (numero == juego.Numeros[j])
                {
                    resultado[i] = "parcial";
                    break;
                } // if
            } // for j
        } // for i

        esGanador = (coincidencias == juego.Numeros.Length);

        return resultado;
    } // ComprobarJugada

    #endregion
} // class MastermindController
