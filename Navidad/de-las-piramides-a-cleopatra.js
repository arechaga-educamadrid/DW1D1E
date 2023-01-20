// @ts-check
"use strict"

/**
 * @param {any} numA
 * @param {any} numB
 * @param {any} numC
 * @return {number}
 */
function fecha_mas_cercana(numA, numB, numC) {
    // validaciones: tipo numérico
    if (typeof numA !== "number") return NaN;
    if (typeof numB !== "number") return NaN;
    if (typeof numC !== "number") return NaN;

    // validaciones: números válidos (NaN no es un número)
    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) return NaN;

    // validación: A < B < C
    if ((numA > numB) || (numB > numC)) return NaN;

    // validación: el año 0 no existe
    if ((numA == 0) || (numB == 0) || (numC == 0)) return NaN;

    // validación: rango
    if ((numA < -10000) || (numC > 10000)) return NaN;

    // cálculo
    let distancia1 = distancia_fechas(numA, numB);
    let distancia2 = distancia_fechas(numB, numC);

    if (distancia1 < distancia2) return numA;
    if (distancia1 > distancia2) return numC;
    return 0;

    /**
     * @param {number} fecha1
     * @param {number} fecha2
     * @returns {number}
     */
    function distancia_fechas(fecha1, fecha2) {
        let distancia = (fecha2 - fecha1);

        // ajustamos el año 0. La distancia entre -1 y 1 es 1 y no 2
        if ((fecha1 < 0) && (fecha2 > 0)) distancia -= 1;

        return distancia;
    }
} // fecha_mas_cercana
