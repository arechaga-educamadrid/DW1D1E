// @ts-check
"use strict";

class ObjetoInventario {
    /** @type {string} */
    nombre;

    /** @type {number} */
    valor;

    /** @type {number} */
    peso;

    /**
     * @param {string} nombre
     * @param {number} valor
     * @param {number} peso
     */
    constructor(nombre, valor, peso) {
        this.nombre = nombre;
        this.valor = valor;
        this.peso = peso;
    } // constructor

    /**
     * @param {string} linea
     * @returns {ObjetoInventario | null}
     */
    static obtener(linea) {
        // separamos por espacio
        let partes = linea.split(" ");

        // eliminamos los elementos vacíos (dos o más espacios consecutivos)
        partes = partes.filter(item => item.length > 0);

        // creamos el objeto con las partes
        if (partes.length != 3) return null;
        let nombre = partes[0];
        let valor = Number(partes[1]);
        let peso = Number(partes[2]);

        // es válido?
        if (isNaN(valor) || isNaN(peso)) return null;

        return new ObjetoInventario(nombre, valor, peso);
    } // obtener
} // class ObjetoInventario

/**
 * @param {string | string[] | ObjetoInventario[]} inventario
 * @returns {string[]}
 */
function ordenar_inventario(inventario) {
    let objetos = ordenar_inventario_objetos(inventario);

    // retornamos, conforme se nos pide, los nombres de los elementos
    return objetos.map(objeto => objeto.nombre);
} // ordenar_inventario

/**
 * @param {string | string[] | ObjetoInventario[]} inventario
 * @returns {ObjetoInventario[]}
 */
function ordenar_inventario_objetos(inventario) {
    let objetos = obtener_objetos_inventario(inventario);

    // ordenamos el array
    ordenar_objetos_inventario(objetos);

    return objetos;
} // ordenar_inventario_objetos

/* ----------------------------------------------------------------------- */
// Funciones auxiliares
/* ----------------------------------------------------------------------- */

/**
 * @param {ObjetoInventario[]} inventario
 * @returns void
 */
function ordenar_objetos_inventario(inventario) {
    // añadimos una nueva propiedad con la posición
    inventario.forEach((objeto, indice) => objeto["posicion"] = indice);

    // equivalente a realizar en SQL:
    // ORDER BY [valor], [peso] DESC, [posicion] DESC

    inventario.sort((a, b) => {
        // primero ordenamos por valor
        let comparacion = b.valor - a.valor;
        if (comparacion != 0) return comparacion;

        // luego por peso, a la inversa
        comparacion = b.peso - a.peso;
        if (comparacion != 0) return -comparacion;

        // por último, por posición (a la inversa)
        comparacion = b["posicion"] - a["posicion"];

        return -comparacion;
    });
} // ordenar_objetos_inventario

/* ----------------------------------------------------------------------- */
// Funciones de conversión
/* ----------------------------------------------------------------------- */

/**
 * @param {string | string[] | ObjetoInventario[]} inventario
 * @returns {ObjetoInventario[]}
*/
function obtener_objetos_inventario(inventario) {
    // es un string?
    if (typeof inventario == "string") {
        inventario = obtener_inventario_texto(inventario);
    } // if

    // es un array? tiene elementos?
    if (!Array.isArray(inventario) || (inventario.length == 0)) return [];

    // son líneas de texto?
    if (typeof inventario[0] == "string") {
        inventario = obtener_inventario_lineas(/** @type string[] */ (inventario));
    } // if

    // 'inventario' ahora solo debería ser un array de ObjetoInventario
    return /** @type ObjetoInventario[] */ (inventario);
} // obtener_objetos_inventario

/**
 * @param {string} inventario
 * @returns {string[]}
 */
function obtener_inventario_texto(inventario) {
    // dado que el salto de línea puede venir representado por los
    // caracteres \r, \r\n o \r, "normalizamos" las diferentes formas de indicar
    // un salto de línea, dejando únicamente \n como caracter de salto de línea

    // ¡OJO! string.replace unicamente efectúa un cambio, aunque haya varias coincidencias;
    // para evitarlo, hay que utilizar una expresión regular con el flag de reemplazo global
    inventario = inventario.replace(/\r\n/g, '\n');
    inventario = inventario.replace(/\r/g, '\n');

    return inventario.split("\n");
} // obtener_inventario_texto

/**
 * @param {string[]} inventario
 * @returns {{nombre: string, valor: number, peso: number}[]}
 */
function obtener_inventario_lineas(inventario) {
    /** @type {{nombre: string, valor: number, peso: number}[]} */
    let resultado = [];

    for (let linea of inventario) {
        linea = linea.trim();
        if (linea === "") continue;

        let objeto = ObjetoInventario.obtener(linea);
        if (objeto === null) continue;

        resultado.push(objeto);
    } // for

    return resultado;
} // obtener_inventario_lineas
