// @ts-check
"use strict"

class NumeroJeroglifico {
    /**
     * @param {number} numero
     * @param {string} simbolico
     * @param {string} jeroglifico
     */
    constructor(numero, simbolico, jeroglifico) {
        this.numero = numero;
        this.simbolico = simbolico;
        this.jeroglifico = jeroglifico;
    } // constructor

    /** @type {number} */
    numero;
    /** @type {string} */
    simbolico;
    /** @type {string} */
    jeroglifico;
} // class NumeroJeroglifico

const correspondencias = [
    new NumeroJeroglifico(1000000, "H", '\u{13068}'), // Gardiner C11 (dios HeH)
    new NumeroJeroglifico(100000,  "R", '\u{13190}'), // Gardiner I8 (renacuajo)
    new NumeroJeroglifico(10000,   "D", '\u{130AD}'), // Gardiner D50 (dedo)
    new NumeroJeroglifico(1000,    "F", '\u{131BC}'), // Gardiner M12 (flor de loto)
    new NumeroJeroglifico(100,     "C", '\u{13362}'), // Gardiner V1 (cuerda enrollada)
    new NumeroJeroglifico(10,      "G", '\u{13386}'), // Gardiner V20 (grillete)
    new NumeroJeroglifico(1,       "T", '\u{133E4}'), // Gardiner Z1 (trazo)
];

/**
 * @param {number} numero 
 * @returns {NumeroJeroglifico}
 */
function numeros_jeroglificos_v2(numero) {
    let resultado = new NumeroJeroglifico(numero, "", "");

    // validaciones
    if (isNaN(numero)) return resultado;
    if (numero < 1) return resultado;

    // cálculo
    for (let correspondencia of correspondencias) {
        let cantidad = Math.trunc(numero / correspondencia.numero);
        numero -= cantidad * correspondencia.numero;

        resultado.simbolico += correspondencia.simbolico.repeat(cantidad);
        resultado.jeroglifico += correspondencia.jeroglifico.repeat(cantidad);
    } // for of

    return resultado;
} // numeros_jeroglificos_v2