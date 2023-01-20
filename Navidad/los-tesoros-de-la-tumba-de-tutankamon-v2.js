// @ts-check
"use strict";

window.addEventListener("load", () => {
    let boton = /** @type {HTMLButtonElement} */ (window.document.getElementById("boton_ordenar"));
    boton.addEventListener("click", on_boton_ordenar_click);
});

//function on_boton_ordenar_click(this: HTMLButtonElement, ev: MouseEvent) {
/**
 * @this {HTMLButtonElement}
 * @param {MouseEvent} ev
 */
function on_boton_ordenar_click(ev) {
    let inventario = (/** @type {HTMLTextAreaElement} */ (window.document.getElementById("inventario"))).value;

    let ordenado = ordenar_inventario_objetos(inventario);
    let cuerpo = /** @type {HTMLElement} */ (window.document.getElementById("resultado_ordenacion"));
    cuerpo.textContent = "";

    for (let objeto of ordenado) {
        let nombre = window.document.createElement("td");
        nombre.textContent = objeto.nombre;
        let valor = window.document.createElement("td");
        valor.textContent = `${objeto.valor}`;
        let peso = window.document.createElement("td");
        peso.textContent = `${objeto.peso}`;

        let fila = window.document.createElement("tr");
        fila.append(nombre, valor, peso);
        cuerpo.append(fila);
    } // for-of
} // on_boton_ordenar_click
