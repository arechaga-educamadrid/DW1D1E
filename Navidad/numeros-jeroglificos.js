// @ts-check
"use strict"

/* ------------------------------------------------------------------------ */
// Solución habitual, bucle while
/* ------------------------------------------------------------------------ */

const letras = "HRDFCGT";

/**
 * @param {number} numero 
 * @returns {string}
 */
function numeros_jeroglificos_while(numero) {
    // validaciones
    if (isNaN(numero)) return "";
    if (numero < 1) return "";

    // cálculo
    let resultado = "";
    let divisor = 1000000;
    let indice = 0;

    while (divisor >= 1) {
        let cantidad = Math.trunc(numero / divisor);
        numero -= cantidad * divisor;

        resultado += letras[indice].repeat(cantidad);

        divisor /= 10;
        indice++;
    } // for i

    return resultado;
} // numeros_jeroglificos_v1

/* ------------------------------------------------------------------------ */
// Solución habitual, bucle for
/* ------------------------------------------------------------------------ */

/**
 * @param {number} numero 
 * @returns {string}
 */
function numeros_jeroglificos_for(numero) {
    // validaciones
    if (isNaN(numero)) return "";
    if (numero < 1) return "";

    // cálculo
    let resultado = "";

    for (let indice = 0, divisor = 1000000; divisor >= 1; divisor /= 10, indice++) {
        let cantidad = Math.trunc(numero / divisor);
        numero -= cantidad * divisor;

        resultado += letras[indice].repeat(cantidad);
    } // for

    return resultado;
} // numeros_jeroglificos_for

/* ------------------------------------------------------------------------ */
// Solución más elegante y genérica
/* ------------------------------------------------------------------------ */

class NumeroJeroglifico {
    /**
     * @param {number} numero
     * @param {string} simbolico
     */
    constructor(numero, simbolico) {
        this.numero = numero;
        this.simbolico = simbolico;
    } // constructor

    /** @type {number} */
    numero;
    /** @type {string} */
    simbolico;
} // class NumeroJeroglifico

const correspondencias = [
    new NumeroJeroglifico(1000000, "H"), // Gardiner C11 (dios HeH)
    new NumeroJeroglifico(100000,  "R"), // Gardiner I8 (renacuajo)
    new NumeroJeroglifico(10000,   "D"), // Gardiner D50 (dedo)
    new NumeroJeroglifico(1000,    "F"), // Gardiner M12 (flor de loto)
    new NumeroJeroglifico(100,     "C"), // Gardiner V1 (cuerda enrollada)
    new NumeroJeroglifico(10,      "G"), // Gardiner V20 (grillete)
    new NumeroJeroglifico(1,       "T"), // Gardiner Z1 (trazo)
];

/**
 * @param {number} numero 
 * @returns {string}
 */
function numeros_jeroglificos(numero) {
    // validaciones
    if (isNaN(numero)) return "";
    if (numero < 1) return "";

    // cálculo
    let resultado = "";

    for (let correspondencia of correspondencias) {
        let cantidad = Math.trunc(numero / correspondencia.numero);
        numero -= cantidad * correspondencia.numero;

        resultado += correspondencia.simbolico.repeat(cantidad);
    } // for of

    return resultado;
} // numeros_jeroglificos