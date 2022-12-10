// @ts-check
"use strict";

/*
Versión v3 del juego «Mastermind»
Primera implementación utilizando clases, pero únicamente como meros "contenedores" de propiedades
Modificadas las funciones para recibir un objeto de tipo "Configuracion" o "Juego" según convenga
Eliminadas todas las variables globales, excepto una nueva, "mastermind" que contendrá el "juego"
*/

// --------------------------------------------------------------------------
// Variables y constantes globales
// --------------------------------------------------------------------------

const VALOR_MINIMO_DEFECTO = 1;
const VALOR_MAXIMO_DEFECTO = 9;
const NUMERO_CASILLAS_DEFECTO = 3;

// --------------------------------------------------------------------------
// Definiciones de clases
// --------------------------------------------------------------------------

class ConfiguracionMastermind {
    /**
     * @param {number} minimo
     * @param {number} maximo
     * @param {number} casillas
     */
    constructor(minimo, maximo, casillas) {
        /** @type {number} */
        this.minimo = minimo;

        /** @type {number} */
        this.maximo = maximo;

        /** @type {number} */
        this.casillas = casillas;
    } // constructor
} // class ConfiguracionMastermind

class JuegoMastermind extends ConfiguracionMastermind {
    /**
     * @param {ConfiguracionMastermind} configuracion
     */
    constructor(configuracion) {
        super(configuracion.minimo,
            configuracion.maximo,
            configuracion.casillas);
    } // constructor

    /** @type {number} */
    numero_jugada = 0;
    /** @type {number[]} */
    numeros = [];
} // class JuegoMastermind

// --------------------------------------------------------------------------
// Funciones auxiliares
// --------------------------------------------------------------------------

/**
 * @param {HTMLInputElement} input
 * @param {string} mensaje_error
 * @returns {number}
 */
function validar_input_number_entero(input, mensaje_error) {
    // obtenemos el texto del input eliminando espacis extras
    let valor = input.value.trim();
    let numero = NaN;

    // rechazamos el valor "en blanco"
    if (valor !== "") {
        numero = Number(valor);
    } // if

    // validamos que sea un número
    if (isNaN(numero)) {
        alert(mensaje_error);
        return NaN;
    } // if

    return Math.trunc(numero);
} // validar_input_number_entero

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
        elemento.disabled = !habilitar;
    } // if
} // habilitar_elemento

// --------------------------------------------------------------------------
// Configuración del juego
// --------------------------------------------------------------------------

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

    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_configuracion_casillas"));
    input.value = `${NUMERO_CASILLAS_DEFECTO}`;
} // inicializar_formulario_configuracion

/** 
 * @returns {ConfiguracionMastermind | null} 
 */
function obtener_configuracion() {
    /** @type {HTMLInputElement} */
    let input;

    /** @type {number} */ let minimo;
    /** @type {number} */ let maximo;
    /** @type {number} */ let casillas;

    // obtenemos y validamos los 3 campos input
    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_configuracion_minimo"));
    minimo = validar_input_number_entero(input, "Introduzca un número para mínimo");
    if (isNaN(minimo)) return null;

    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_configuracion_maximo"));
    maximo = validar_input_number_entero(input, "Introduzca un número para máximo");
    if (isNaN(minimo)) return null;

    input = /** @type {HTMLInputElement} */ (window.document.getElementById("input_configuracion_casillas"));
    casillas = validar_input_number_entero(input, "Introduzca un número para casillas");
    if (isNaN(casillas)) return null;

    // comprobamos que el mínimo sea menor que el máximo
    if (minimo > maximo) {
        window.alert("El mínimo es mayor que el máximo");
        return null;
    } // if

    // comprobamos que el número de casillas sea mayor de 0
    if (casillas < 1) {
        window.alert("El número de casillas ha de ser mayor de 0");
        return null;
    } // if

    // comprobamos que el rango sea al menos igual al número de casillas
    let rango = (maximo - minimo) + 1;
    if (rango < casillas) {
        window.alert(`El rango es menor que ${casillas}`);
        return null;
    } // if

    // creamos el objeto de configuración y lo devolvemos
    let configuracion = new ConfiguracionMastermind(minimo, maximo, casillas);

    return configuracion;
} // obtener_configuracion

/**
 * @param {HTMLFormElement} formulario
 * @param {ConfiguracionMastermind} configuracion
 * @returns {void}
 */
function configurar_formulario_jugada(formulario, configuracion) {
    for (let i = 1; i <= configuracion.casillas; i++) {
        let input = window.document.createElement("input");
        input.id = `input_jugada_${i}`;
        input.type = "text";
        input.size = 4;

        formulario.append(input, " ");
    } // for i

    let boton = window.document.createElement("button");
    boton.id = "boton_enviar";
    boton.type = "button";
    boton.textContent = "Enviar jugada";
    boton.addEventListener("click", on_boton_enviar_click);

    formulario.append(boton);
} // configurar_formulario_jugada

/** 
 * @returns {void} 
 */
function on_boton_configurar_click() {
    let configuracion = obtener_configuracion();
    if (configuracion === null) return;

    // guardar configuración e inhabilitar botón de configuración
    habilitar_elemento("boton_configurar", false);

    // crear y mostrar formulario de jugada
    let form = /** @type {HTMLFormElement} */ (window.document.getElementById("formulario-jugada"));
    configurar_formulario_jugada(form, configuracion);
    form.classList.remove("oculto");

    // creamos el objeto del juego y lo inicializamos
    mastermind = new JuegoMastermind(configuracion);
    mastermind.numeros = obtener_numeros(mastermind);
} // on_boton_configurar_click

// --------------------------------------------------------------------------
// Funciones del juego
// --------------------------------------------------------------------------

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
 * @param {ConfiguracionMastermind} configuracion
 * @returns {number[]}
 */
function obtener_numeros(configuracion) {
    let numeros = new Array(configuracion.casillas);

    for (let i = 0; i < configuracion.casillas; i++) {
        let repetido;
        let numero;
        do {
            repetido = false;
            numero = numero_aleatorio(configuracion.minimo, configuracion.maximo);
            for (let j = 0; j < i; j++) {
                if (numero === numeros[j]) {
                    repetido = true;
                    break;
                } // if
            } // for j
        } while (repetido);
        numeros[i] = numero;
    } // for

    return numeros;
} // obtener_numeros

/**
 * @param {ConfiguracionMastermind} configuracion
 * @returns {number[] | null}
 */
function obtener_jugada(configuracion) {
    let jugada = [];

    // obtenemos los intentos del jugador
    for (let i = 1; i <= configuracion.casillas; i++) {
        let input = /** @type {HTMLInputElement} */(window.document.getElementById(`input_jugada_${i}`));
        let valor = validar_input_number_entero(input, `El número ${i} no es válido`);
        if (isNaN(valor)) return null;

        // almacenamos
        jugada.push(valor);
    } // for i

    return jugada;
} // obtener_jugada

/**
 * @param {ConfiguracionMastermind} configuracion
 * @returns {HTMLTableElement}
 */
function obtener_tabla_jugadas(configuracion) {

    let tabla = /** @type HTMLTableElement */ (window.document.getElementById("tabla-jugadas"));

    // hay que crear la tabla?
    if (tabla === null) {
        tabla = crear_tabla();
        window.document.body.append(tabla);
    } // if

    return tabla;

    /**
     * @returns {HTMLTableElement}
     */
    function crear_tabla() {
        let tabla = window.document.createElement("table");
        tabla.id = "tabla-jugadas";

        let cabecera = window.document.createElement("thead");
        let fila = window.document.createElement("tr");

        let celda = window.document.createElement("th");
        celda.textContent = "#";
        fila.append(celda);

        for (let i = 1; i <= configuracion.casillas; i++) {
            let celda = window.document.createElement("th");
            celda.textContent = `${i}`;
            fila.append(celda);
        } // for

        cabecera.append(fila);
        tabla.append(cabecera);

        return tabla;
    } // crear_tabla_jugadas
} // obtener_tabla_jugadas

/**
 * @param {number} intento
 * @param {number} indice
 * @param {JuegoMastermind} juego
 * @returns {HTMLTableCellElement}
 */
function crear_celda_respuesta(intento, indice, juego) {
    let className;
    let numeros = juego.numeros;
    let celda = window.document.createElement("td");

    celda.textContent = `${intento}`;
    // validación de rango
    if ((intento < juego.minimo) || (intento > juego.maximo)) {
        className = "resultado-error"
    } else if (intento === numeros[indice]) {
        className = "resultado-acierto";
    } else {
        // asumimos que no hay acierto parcial
        className = "resultado-fallo";

        // verificamos si es parcial
        for (let i = 0; i < numeros.length; i++) {
            if (intento == numeros[i]) {
                className = "resultado-parcial";
                break;
            } // if
        } // for i
    } // if-else
    celda.className = className;

    return celda;
} // crear_celda_respuesta

/**
 * @param {HTMLTableElement} tabla
 * @param {number[]} jugada
 * @param {JuegoMastermind} juego
 * @returns {void}
 */
function mostrar_resultado_jugada(tabla, jugada, juego) {
    // validación interna
    window.console.assert(jugada.length == juego.numeros.length);

    let fila = window.document.createElement("tr");

    // mostramos el número de jugada
    let celda = window.document.createElement("td");
    celda.textContent = `${juego.numero_jugada}`;
    fila.append(celda);

    // comparamos el intento del jugador con cada número y creamos la columna (celda) con la respuesta
    for (let i = 0; i < jugada.length; i++) {
        celda = crear_celda_respuesta(jugada[i], i, juego);
        fila.append(celda);
    } // for i

    // añadimos la fila con la respuesta
    tabla.append(fila);
} // mostrar_resultado_jugada

/**
 * @param {number[]} jugada
 * @param {JuegoMastermind} juego
 * @returns {boolean}
 */
function verificar_ha_ganado(jugada, juego) {
    let numeros = juego.numeros;

    // validación interna
    window.console.assert(jugada.length == numeros.length);

    for (let i = 0; i < jugada.length; i++) {
        if (jugada[i] != numeros[i]) return false;
    } // for i

    return true;
} // verificar_ha_ganado

/**
 * @param {JuegoMastermind} juego
 */
function mostrar_ha_ganado(juego) {
    // creamos el mensaje
    let mensaje = window.document.createElement("div");
    mensaje.textContent = `¡Enhorabuena! Has acertado los ${juego.casillas} números`;
    mensaje.className = "enhorabuena";

    // añadimos el mensaje al final
    window.document.body.append(mensaje);

    // inhabilitamos el botón de jugar
    habilitar_elemento("boton_enviar", false);
} // mostrar_ha_ganado

/** 
 * @returns {void} 
 */
function on_boton_enviar_click() {
    // incrementamos el número de jugada
    mastermind.numero_jugada++;

    // obtenemos la jugada
    let jugada = obtener_jugada(mastermind);
    if (jugada === null) return;

    // verificamos la jugada y la "pintamos"
    let tabla = obtener_tabla_jugadas(mastermind);
    mostrar_resultado_jugada(tabla, jugada, mastermind);

    // comprobamos si ha ganado
    if (verificar_ha_ganado(jugada, mastermind)) {
        mostrar_ha_ganado(mastermind);
    } // if-else
} // on_boton_enviar_click

// --------------------------------------------------------------------------
// Código global
// --------------------------------------------------------------------------

/** @type {JuegoMastermind} */
var mastermind;

// al cargar, inicializamos el formulario de configuración
window.addEventListener("load", inicializar_formulario_configuracion);
