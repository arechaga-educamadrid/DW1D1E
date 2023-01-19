// @ts-check
"use strict";

var id_juego = "";

function on_boton_nuevo_click() {
    var configuracion = {
        minimo: 1,
        maximo: 9,
        casillas: 3
    };

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", peticion_juego_nuevo_aceptada);
    xhr.addEventListener("error", peticion_juego_nuevo_error);

    xhr.open("POST", "http://localhost:5011/v1/mastermind");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    var cuerpo = JSON.stringify(configuracion);
    xhr.send(cuerpo);
} // on_boton_nuevo_click

/**
 * @param {ProgressEvent<XMLHttpRequestEventTarget>} ev
 */
function peticion_juego_nuevo_aceptada(ev) {
    let xhr = /** @type {XMLHttpRequest} */ (ev.target);
    if ((xhr.status < 200) || (xhr.status >= 300)) {
        alert(`Se ha producido un error al crear la partida.
Estado = ${xhr.status}
Resultado: ${xhr.responseText}`);
        return;
    } // if

    id_juego = JSON.parse(xhr.responseText);
} // peticion_juego_nuevo_aceptada

/**
 * @param {ProgressEvent<XMLHttpRequestEventTarget>} ev
 */
function peticion_juego_nuevo_error(ev) {
    let xhr = /** @type {XMLHttpRequest} */ (ev.target);
    alert(`Se ha producido un error al crear la partida. Error desconocido`);
} // peticion_juego_nuevo_error

function on_boton_jugar_click() {
    let numero1 = /** @type {HTMLInputElement} */ (window.document.getElementById("numero_1")).valueAsNumber;
    let numero2 = window.document.getElementById("numero_2").valueAsNumber;
    let numero3 = window.document.getElementById("numero_3").valueAsNumber;

    var jugada = {
        numeros: [numero1, numero2, numero3],
    };

    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", peticion_jugada_aceptada);
    //xhr.addEventListener("error", peticion_juego_nuevo_error);

    xhr.open("POST", `http://localhost:5011/v1/mastermind/${id_juego}/jugada`);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
    var cuerpo = JSON.stringify(jugada);
    xhr.send(cuerpo);

} // on_boton_jugar_click

/**
 * @param {ProgressEvent<XMLHttpRequestEventTarget>} ev
 */
function peticion_jugada_aceptada(ev) {
    let xhr = /** @type {XMLHttpRequest} */ (ev.target);
    if ((xhr.status < 200) || (xhr.status >= 300)) {
        alert(`Se ha producido un error al enviar la jugada.
Estado = ${xhr.status}
Resultado: ${xhr.responseText}`);
        return;
    } // if

    let respuesta = JSON.parse(xhr.responseText);
    alert(respuesta.resultado);
} // peticion_jugada_aceptada
