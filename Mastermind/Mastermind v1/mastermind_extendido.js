// @ts-check
"use strict";

/** 
 * @returns {void} 
 */
function inicializar_formulario_configuracion() {
    /** @type {HTMLInputElement} */
    let input;
    
    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_configuracion_minimo"));
    input.value = `${VALOR_MINIMO_DEFECTO}`;

    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_configuracion_maximo"));
    input.value = `${VALOR_MAXIMO_DEFECTO}`;
} // inicializar_formulario_configuracion

/** 
 * @returns {boolean} 
 */
function obtener_configuracion() {
    /** @type {HTMLInputElement} */
    let input;
    
    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_configuracion_minimo"));
    if (input.value === "") {
        alert("Introduzca un valor para mínimo");
        return false;
    } // if
    let minimo = Number(input.value);

    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_configuracion_maximo"));
    if (input.value === "") {
        alert("Introduzca un valor para máximo");
        return false;
    } // if
    let maximo = Number(input.value);

    // comprobamos que el mínimo sea menor que el máximo
    if (minimo > maximo) {
        window.alert(`El mínimo es mayor que el máximo`);
        return false;
    } // if

    // comprobamos que el rango sea igual al número de casillas
    let rango = (maximo - minimo) + 1;
    if (rango < NUMERO_CASILLAS) {
        window.alert(`El rango es menor que ${NUMERO_CASILLAS}`);
        return false;
    } // if

    // asignamos a variables globales
    valor_minimo = minimo;
    valor_maximo = maximo;

    return true;
} // obtener_configuracion

/** 
 * @returns {void} 
 */
function on_boton_configurar_click() {
    if (!obtener_configuracion()) return;

    habilitar_elemento("boton_configurar", false);

    // mostrar formulario de jugada
    let form = window.document.getElementById("formulario-jugada");
    if (form != null) {
        form.classList.remove("oculto");
    } // if
} // on_boton_configurar_click

// al cargar, inicializamos el formulario de configuración
window.addEventListener("load", inicializar_formulario_configuracion);