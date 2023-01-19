// @ts-check

class HtmlUtils {
    /**
    * @param {string} id
    * @param {string} mensaje_error
    * @returns {number}
    */
    static input_entero(id, mensaje_error) {
        let elemento = window.document.getElementById(id);
        if (elemento == null) {
            window.console.warn("obtener_input_numero_entero(): input %o no localizado", id);
            return NaN;
        } // if

        if (!("value" in elemento)) {
            window.console.warn("obtener_input_numero_entero(): input %o sin 'value'", id);
            return NaN;
        } // if

        // 'convertimos' de HTMLElement a HtmlInputElement
        let input = /** @type {HTMLInputElement} */ (elemento);

        // obtenemos el texto del input eliminando espacios extras
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
    } // input_entero

    /**
     * @param {string} id_elemento
     * @param {boolean} habilitar
     * @returns {void}
     */
    static habilitar(id_elemento, habilitar) {
        let elemento = window.document.getElementById(id_elemento);
        if (elemento === null) {
            window.console.warn("habilitar(): elemento %o no localizado", id_elemento);
            return;
        }

        // existe la propiedad "disabled"?
        if ("disabled" in elemento) {
            // @ts-ignore
            elemento.disabled = !habilitar;
        }
        else {
            window.console.warn("habilitar(): elemento %o sin propiedad 'disabled'", id_elemento);
        } // if-else
    } // habilitar

    /**
     * @param {string} id_elemento
     * @param {string} texto
     * @returns {void}
     */
     static textContent(id_elemento, texto) {
        let elemento = window.document.getElementById(id_elemento);
        if (elemento === null) {
            window.console.warn("textContent(): elemento %o no localizado", id_elemento);
            return;
        } // if

        elemento.textContent = texto;
    } // textContent
} // class HtmlUtils