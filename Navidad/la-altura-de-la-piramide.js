// @ts-check
"use strict";

/**
 * @param {number} bloques
 * @param {number} huecos
 * @returns {number}
 */
function altura_maxima_piramide(bloques, huecos) {
    let nivel = 0;
    let porcentaje_huecos = huecos / 100; // transformamos de 0-50 a 0-0.50

    while (bloques > 0) {
        let necesarios = calcular_bloques_necesarios(nivel + 1, porcentaje_huecos);
        if (bloques >= necesarios) {
            nivel++;
        } // if

        bloques -= necesarios;
    } // while

    return nivel;
} // altura_maxima_piramide

/**
 * @param {number} bloques
 * @param {number} huecos
 * @returns {{altura: number, sobran: number, faltan: number}}
 */
function altura_maxima_piramide_v2(bloques, huecos) {
    let nivel = 0;
    let porcentaje_huecos = huecos / 100; // transformamos de 0-50 a 0-0.50

    let sobran = 0;
    let faltan = 0;

    while (bloques > 0) {
        let necesarios = calcular_bloques_necesarios(nivel + 1, porcentaje_huecos);
        if (bloques >= necesarios) {
            nivel++;
            sobran = bloques - necesarios;
        } else {
            faltan = necesarios - bloques;
        } // if-else

        bloques -= necesarios;
    } // while

    return {
        altura: nivel,
        sobran: sobran,
        faltan: faltan
    };
} // altura_maxima_piramide_v2

/**
 * @param {number} nivel
 * @param {number} porcentaje_huecos
 * @returns {number}
 */
function calcular_bloques_necesarios(nivel, porcentaje_huecos) {
    // calculamos los bloques necesarios si la pirámide fuera sólida
    let necesarios = Math.pow((nivel * 2) - 1, 2);

    // número de huecos máximo
    let huecos = Math.trunc(Math.floor(necesarios * porcentaje_huecos));

    return necesarios - huecos;
} // calcular_bloques_necesarios

