// @ts-check
"use strict";

/*
Versión v4 del juego «Mastermind»

Utilizamos más en profundidad los objetos. En particular, el del juego
Entre otros cambios,Se ha separado el análisis de la jugada de su
correspondiente visualización. La comprobación de mínimo y máximo se ha
movido del código del formulario al propio análisis de la jugada
*/

// ==========================================================================
// Variables y constantes globales
// ==========================================================================

const VALOR_MINIMO_DEFECTO = 1;
const VALOR_MAXIMO_DEFECTO = 9;
const NUMERO_CASILLAS_DEFECTO = 3;

// ==========================================================================
// Definiciones de clases
// ==========================================================================

// ------------------------------------------------------------------
// Clase JuegoMastermind

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

// ------------------------------------------------------------------
// Clase JuegoMastermind

class JuegoMastermind extends ConfiguracionMastermind {
    /**
     * @param {ConfiguracionMastermind} configuracion
     */
    constructor(configuracion) {
        super(configuracion.minimo,
            configuracion.maximo,
            configuracion.casillas);

        this._numeros = this._obtener_numeros();
    } // constructor

    // ----------------------------------------------------
    // campos (fields) privados

    /** @type {number} */
    _numero_jugada = 0;
    /** @type {number[]} */
    _numeros;
    /** @type {boolean} */
    _es_ganador;

    // ----------------------------------------------------
    // propiedades (públicas)

    /**
     * @returns {number}
     */
    get numero_jugada() {
        return this._numero_jugada;
    } // get numero_jugada

    /**
     * @returns {number[]}
     */
    get numeros() {
        return this._numeros;
    } // get numero_jugada

    /**
     * @returns {boolean}
     */
    get es_ganador() {
        return this._es_ganador;
    } // get numero_jugada

    // ----------------------------------------------------
    // métodos (públicos)

    /**
     * @param {number[]} jugada
     */
    realizar_jugada(jugada) {
        // validación interna
        window.console.assert(jugada.length == this.numeros.length, "realizar_jugada(): jugada.length != this.numeros.length");

        // incrementamos el número de jugada
        this._numero_jugada++;

        let resultado = /** @type {string[]} */ ([]);
        let coincidencias = 0;
        for (let i=0 ; i<this.numeros.length ; i++)
        {
            let numero = jugada[i];
            // fuera de rango?
            if ((numero < this.minimo) || (numero > this.maximo))
            {
                resultado[i] = "error";
                continue;
            } // if

            // coincidencia?
            if (numero == this.numeros[i])
            {
                resultado[i] = "acierto";
                coincidencias++;
                continue;
            } // if

            // asumimos fallo
            resultado[i] = "fallo";

            // coincidencia parcial?
            for (let j=0 ; j<this.numeros.length ; j++)
            {
                if (numero == this.numeros[j])
                {
                    resultado[i] = "parcial";
                    break;
                } // if
            } // for j
        } // for i

        this._es_ganador = (coincidencias == this.numeros.length);

        return resultado;
    } // realizar_jugada

    // métodos (internos)
    /**
     * @returns {number[]}
     */
    _obtener_numeros() {
        let numeros = new Array(this.casillas);

        for (let i = 0; i < this.casillas; i++) {
            let repetido;
            let numero;
            do {
                repetido = false;
                numero = numero_aleatorio(this.minimo, this.maximo);
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
} // class JuegoMastermind

// ==========================================================================
// Funciones auxiliares
// ==========================================================================

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

// ==========================================================================
// Configuración del juego
// ==========================================================================

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

    // creamos el objeto del juego
    mastermind = new JuegoMastermind(configuracion);
} // on_boton_configurar_click

// ==========================================================================
// Funciones del juego
// ==========================================================================

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

// obtener_numeros
// se ha movido dentro de la clase del juego

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

// crear_celda_respuesta
// se ha movido (y modificado) a mostrar_resultado_jugada()

/**
 * @param {HTMLTableElement} tabla
 * @param {JuegoMastermind} juego
 * @param {number[]} jugada
 * @param {string[]} resultado
 * @returns {void}
 */
function mostrar_resultado_jugada(tabla, juego, jugada, resultado) {
    // validación interna
    window.console.assert(jugada.length == juego.numeros.length, "mostrar_resultado_jugada(): jugada.length != juego.numeros.length");

    let fila = window.document.createElement("tr");

    // mostramos el número de jugada
    let celda = window.document.createElement("td");
    celda.textContent = `${juego.numero_jugada}`;
    fila.append(celda);

    // comparamos el intento del jugador con cada número y creamos la columna (celda) con la respuesta
    for (let i = 0; i < jugada.length; i++) {
        celda = crear_celda(i);
        fila.append(celda);
    } // for i

    // añadimos la fila con la respuesta
    tabla.append(fila);

    /**
     * @param {number} indice
     * @returns {HTMLTableCellElement}
     */
    function crear_celda(indice) {
        let className;
        let numeros = juego.numeros;
        let celda = window.document.createElement("td");
    
        celda.textContent = `${jugada[indice]}`;
        switch (resultado[indice]) {
            case "acierto":
                className = "resultado-acierto";
                break;
            case "fallo":
                className = "resultado-fallo";
                break;
            case "parcial":
                className = "resultado-parcial";
                break;
            case "error":
                celda.textContent += "!"
                className = "resultado-error";
                break;
            default:
                // validación interna
                window.console.assert(false, "mostrar_resultado_jugada().crear_celda(): switch %o inválido", resultado[indice]);
                className = "resultado-error";
                break;
        } // switch
        celda.className = className;
    
        return celda;
    } // crear_celda
} // mostrar_resultado_jugada

// verificar_ha_ganado
// este código ya no es necesario
// el propio juego ya nos indica si la jugada es ganadora

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
    // obtenemos la jugada
    let jugada = obtener_jugada(mastermind);
    if (jugada === null) return;

    // pedimos al juego que analice la jugada
    let resultado = mastermind.realizar_jugada(jugada)

    // "pintamos" el resultado de la jugada
    let tabla = obtener_tabla_jugadas(mastermind);
    mostrar_resultado_jugada(tabla, mastermind, jugada, resultado);

    // comprobamos si ha ganado
    if (mastermind.es_ganador) {
        mostrar_ha_ganado(mastermind);
    } // if-else
} // on_boton_enviar_click

// ==========================================================================
// Código global
// ==========================================================================

/** @type {JuegoMastermind} */
var mastermind;

// al cargar, inicializamos el formulario de configuración
window.addEventListener("load", inicializar_formulario_configuracion);
