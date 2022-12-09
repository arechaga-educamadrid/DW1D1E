// @ts-check
"use strict";

// constantes propias
const VALOR_MINIMO_DEFECTO = 1;
const VALOR_MAXIMO_DEFECTO = 9;
const NUMERO_CASILLAS = 3;

// variables globales del ejercicio
/** @type {number} */ var jugada_1;
/** @type {number} */ var jugada_2
/** @type {number} */ var jugada_3;

/** @type {number} */ var numero_1;
/** @type {number} */ var numero_2;
/** @type {number} */ var numero_3;

// variables globales propias
/** @type {number} */ var valor_minimo = VALOR_MINIMO_DEFECTO;
/** @type {number} */ var valor_maximo = VALOR_MAXIMO_DEFECTO;
/** @type {number} */ var numero_jugada = 0;

// --------------------------------------------------------------------------
// Funciones pedidas
// --------------------------------------------------------------------------

/**
 * @returns {boolean}
 */
function obtener_jugada() {
    let input1 = /** @type {HTMLInputElement} */(window.document.getElementById("input_numero_1"));
    let input2 = /** @type {HTMLInputElement} */(window.document.getElementById("input_numero_2"));
    let input3 = /** @type {HTMLInputElement} */(window.document.getElementById("input_numero_3"));

    let valor1 = input1.value;
    let valor2 = input2.value;
    let valor3 = input3.value;

    // obtenemos los intentos del jugador y convertimos a "entero"
    let jugada1 = Math.trunc(Number(valor1));
    let jugada2 = Math.trunc(Number(valor2));
    let jugada3 = Math.trunc(Number(valor3));

    // tratamos como no válido la entrada en blanco
    if (valor1 == "") jugada1 = NaN;
    if (valor2 == "") jugada2 = NaN;
    if (valor3 == "") jugada3 = NaN;

    // validamos
    if (!validar_jugada(jugada1, jugada2, jugada3)) {
        return false;
    } // if

    // guardamos en las variables globales
    jugada_1 = jugada1;
    jugada_2 = jugada2;
    jugada_3 = jugada3;

    return true;
} // obtener_jugada

/**
 * @param {number} minimo 
 * @param {number} maximo 
 * @returns {number} 
 */
function numero_aleatorio(minimo, maximo) {
    let rango = (maximo - minimo) + 1;
    let random = Math.random();
    let aleatorio = Math.trunc(random * rango) + minimo;

    return aleatorio;
} // numero_aleatorio

/**
 * @param {number} minimo
 * @param {number} maximo
 * @returns {void} 
 */
function obtener_numeros(minimo, maximo) {
    let aleatorio_1, aleatorio_2, aleatorio_3;

    // obtenemos el primer número
    aleatorio_1 = numero_aleatorio(minimo, maximo);

    // obtenemos el segundo número
    do {
        aleatorio_2 = numero_aleatorio(minimo, maximo);
    } while (aleatorio_2 == aleatorio_1);

    // obtenemos el tercer número
    do {
        aleatorio_3 = numero_aleatorio(minimo, maximo);
    } while ((aleatorio_3 == aleatorio_1) || (aleatorio_3 == aleatorio_2))

    // asignamos a las variables globales
    numero_1 = aleatorio_1;
    numero_2 = aleatorio_2;
    numero_3 = aleatorio_3;
} // obtener_numeros

/**
 * @returns {boolean} 
 */
 function verificar_ha_ganado() {
    if ((jugada_1 != numero_1) || (jugada_2 != numero_2) || (jugada_3 != numero_3)) {
        return false;
    } // if

    // creamos el mensaje
    let mensaje = window.document.createElement("div");
    mensaje.textContent = "¡Enhorabuena! Has acertado los 3 números";
    mensaje.className = "enhorabuena";

    // añadimos el mensaje al final
    window.document.body.append(mensaje);

    return true;
} // verificar_ha_ganado

/**
 * @param {number} jugada
 * @param {number} numero
 * @returns {HTMLTableCellElement}
 */
function crear_celda_respuesta(jugada, numero) {
    let className;
    let celda = window.document.createElement("td");

    celda.textContent = `${jugada}`;
    if (jugada === numero) {
        className = "resultado-acierto";
    }
    else {
        if ((jugada === numero_1) ||
            (jugada === numero_2) ||
            (jugada === numero_3)) {
            className = "resultado-parcial";
        }
        else {
            className = "resultado-fallo";
        } // if-else
    } // if-else
    celda.className = className;

    return celda;
} // crear_columna

/**
 * @param {HTMLTableElement} tabla
 * @param {number} numero_jugada
 * @returns {void}
 */
function verificar_jugada(tabla, numero_jugada) {
    let fila = window.document.createElement("tr");

    // mostramos el número de jugada
    let celda = window.document.createElement("td");
    celda.textContent = `${numero_jugada}`;
    fila.append(celda);

    // comparamos el intento del jugador con cada número y creamos la columna (celda) con la respuesta
    celda = crear_celda_respuesta(jugada_1, numero_1);
    fila.append(celda);
    celda = crear_celda_respuesta(jugada_2, numero_2);
    fila.append(celda);
    celda = crear_celda_respuesta(jugada_3, numero_3);
    fila.append(celda);

    // añadimos la fila con la respuesta
    tabla.append(fila);
} // verificar_jugada

// --------------------------------------------------------------------------
// Funciones propias
// --------------------------------------------------------------------------

/**
 * @param {number} entrada_1
 * @param {number} entrada_2
 * @param {number} entrada_3
 * @returns {boolean}
 */
function validar_jugada(entrada_1, entrada_2, entrada_3) {
    if (isNaN(entrada_1) || (entrada_1 < valor_minimo) || (entrada_1 > valor_maximo)) {
        alert("El primer número no es válido");
        return false;
    } // if

    if (isNaN(entrada_2) || (entrada_2 < valor_minimo) || (entrada_2 > valor_maximo)) {
        alert("El segundo número no es válido");
        return false;
    } // if

    if (isNaN(entrada_3) || (entrada_3 < valor_minimo) || (entrada_3 > valor_maximo)) {
        alert("El tercer número no es válido");
        return false;
    } // if

    return true;
} // validar_jugada

/**
 * @param {number} numero_casillas
 * @returns {HTMLTableElement}
 */
function crear_tabla_jugadas(numero_casillas) {
    let tabla = window.document.createElement("table");
    tabla.id = "tabla-jugadas";

    let cabecera = window.document.createElement("thead");
    let fila = window.document.createElement("tr");

    let celda = window.document.createElement("th");
    celda.textContent = "#";
    fila.append(celda);

    for (let i = 1; i <= numero_casillas; i++) {
        let celda = window.document.createElement("th");
        celda.textContent = `${i}`;
        fila.append(celda);
    } // for

    cabecera.append(fila);
    tabla.append(cabecera);

    return tabla;
} // crear_tabla_jugadas

/**
 * @returns {HTMLTableElement}
 */
function obtener_tabla_jugadas() {
    let tabla = /** @type HTMLTableElement */ (window.document.getElementById("tabla-jugadas"));

    // hay que crear la tabla?
    if (tabla === null) {
        tabla = crear_tabla_jugadas(NUMERO_CASILLAS);
        window.document.body.append(tabla);
    } // if

    return tabla;
} // obtener_tabla_jugadas

/**
 * @param {string} id_elemento
 * @param {boolean} habilitar
 * @returns {void}
 */
function habilitar_elemento(id_elemento, habilitar) {
    let elemento = window.document.getElementById(id_elemento);
    if (elemento === null) return;

    // existe la propiedad "disabled"?
    if ("disabled" in elemento) {
        // @ts-ignore
        elemento.disabled = habilitar ? null : "disabled";
    } // if
} // habilitar_elemento

/** 
 * @returns {void} 
 */
function on_boton_enviar_click() {
    // inicializamos el juego
    if (numero_jugada == 0) {
        obtener_numeros(valor_minimo, valor_maximo);
        numero_jugada = 1;
    } // if

    // obtenemos la jugada
    if (!obtener_jugada()) return;

    // verificamos la jugada y la "pintamos"
    let tabla = obtener_tabla_jugadas();
    verificar_jugada(tabla, numero_jugada);

    // comprobamos si ha ganado
    if (!verificar_ha_ganado()) {
        // incrementamos el número de jugada
        numero_jugada++;
    }
    else {
        // inhabilitamos el botón de jugar
        habilitar_elemento("boton_enviar", false);
    } // if-else
} // on_boton_enviar_click
