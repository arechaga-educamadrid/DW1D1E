// @ts-check
"use strict"

var primera_ejecucion = true;

window.onload = () => {
    let boton = /** @type {HTMLButtonElement} */ (window.document.getElementById("boton_calcular"));
    boton.addEventListener("click", on_boton_calcular_click);
};

function on_boton_calcular_click() {
    let inputA = /** @type {HTMLInputElement} */ (window.document.getElementById("input_numero_a"));
    let inputB = /** @type {HTMLInputElement} */ (window.document.getElementById("input_numero_b"));
    let inputC = /** @type {HTMLInputElement} */ (window.document.getElementById("input_numero_c"));

    let valorA = inputA.value;
    let valorB = inputB.value;
    let valorC = inputC.value;

    let numeroA = Number(valorA);
    let numeroB = Number(valorB);
    let numeroC = Number(valorC);

    let resultado = fecha_mas_cercana(numeroA, numeroB, numeroC);

    let tabla = obtener_tabla_resultados();
    mostrar_resultado(tabla, valorA, valorB, valorC, resultado);
} // on_boton_calcular_click

/**
 * @returns {HTMLTableSectionElement}
 */
function obtener_tabla_resultados() {
    // es la primera ejecución?
    if (primera_ejecucion) {
        // mostramos la tabla
        let tabla = /** @type {HTMLTableElement} */ (window.document.getElementById("tabla_resultados"));
        primera_ejecucion = false;
        tabla.classList.remove("oculto");
    } // if

    let cuerpo = /** @type {HTMLTableSectionElement} */ (window.document.getElementById("tabla_resultados_cuerpo"));

    return cuerpo;
} // obtener_tabla_resultados

/**
 * @param {HTMLTableSectionElement} cuerpo
 * @param {string} a
 * @param {string} b
 * @param {string} c
 * @param {number} resultado
 */
function mostrar_resultado(cuerpo, a, b, c, resultado) {
    let fila = window.document.createElement("tr");

    let celda = window.document.createElement("td");
    celda.textContent = a;
    fila.append(celda);

    celda = window.document.createElement("td");
    celda.textContent = b;
    fila.append(celda);

    celda = window.document.createElement("td");
    celda.textContent = c;
    fila.append(celda);

    celda = window.document.createElement("td");
    celda.textContent = `${resultado}`;
    fila.append(celda);

    cuerpo.append(fila);
} // mostrar_resultado