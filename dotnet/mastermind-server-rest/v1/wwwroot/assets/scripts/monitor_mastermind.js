// @ts-check

// ==========================================================================
// Variables y constantes globales
// ==========================================================================

const TIEMPO_REFRESCO_DEFECTO = 60;

var id_timer_monitor = NaN;
var url_monitor = "";

// ==========================================================================
// Acceso al controlador
// ==========================================================================

/**
 * @returns {void}
 */
function inicializar_formulario_controlador() {
    let location = window.location;
    let url = `${location.protocol}//${location.host}/v1/mastermind`;
    let input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_url_controlador"));
    input.value = url;

    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_tiempo_refresco"));
    input.value = String(TIEMPO_REFRESCO_DEFECTO);
} // inicializar_formulario_controlador

/**
 * @returns {boolean}
 */
function obtener_datos_monitorizacion() {
    let input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_url_controlador"));
    url_monitor = input.value.trim();

    let segundos = HtmlUtils.input_entero("input_tiempo_refresco", "Tiempo de refresco no es válido");
    if (isNaN(segundos)) return false;

    return true;
} // obtener_datos_monitorizacion

/**
 * @returns {void}
 */
function on_boton_iniciar_click() {
    if (!iniciar_monitorizacion()) return;

    HtmlUtils.habilitar("boton_iniciar", false);
    HtmlUtils.habilitar("boton_parar", true);
} // on_boton_iniciar_click

/**
 * @returns {void}
 */
function on_boton_parar_click() {
    if (!parar_monitorizacion()) return;

    HtmlUtils.habilitar("boton_iniciar", true);
    HtmlUtils.habilitar("boton_parar", false);
} // on_boton_parar_click

/**
 * @returns {void}
 */
 function on_boton_actualizar_click() {

} // on_boton_actualizar_click

// ==========================================================================
// Monitorización
// ==========================================================================

/**
 * @returns {boolean}
 */
function iniciar_monitorizacion() {
    if (!obtener_datos_monitorizacion()) return false;

    /*
    fetch(url_monitor + "/e839157f-8ab3-4f45-841d-27947036828e", { method: 'GET', mode: 'cors', headers: { 'Acept': 'application/json' } })
        .then((respuesta) => respuesta.json())
        .then((datos) => {
            HtmlUtils.textContent("label_estado_monitorizacion", "Iniciado");
            alert(datos);
        }
        )
        .catch((error) => {
            alert(error)
        }
        );
    */

    HtmlUtils.textContent("label_estado_monitorizacion", "Iniciando monitorización...");

    return true;
} // iniciar_monitorizacion

/**
 * @returns {boolean}
 */
function parar_monitorizacion() {
    // detener el temporizador
    if (!isNaN(id_timer_monitor)) {
        window.clearInterval(id_timer_monitor);
        id_timer_monitor = NaN;
    } // if

    HtmlUtils.textContent("label_estado_monitorizacion", "Monitorización detenida");

    return true;
} // parar_monitorizacion

// ==========================================================================
// Código global
// ==========================================================================

window.addEventListener("load", inicializar_formulario_controlador);
