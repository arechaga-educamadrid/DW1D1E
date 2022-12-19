// @ts-check
"use strict"

window.addEventListener("load", () => {
    let flota, config;

    config = new ConfiguracionJuego(9, 9);
    probar_generador(config, 5, "Flota «clásica»");

    flota = ConfiguracionJuego.obtenerFlotaAmpliada();
    config = new ConfiguracionJuego(12, 12, flota);
    probar_generador(config, 5, "Flota «ampliada»");

    /**
     * @param {ConfiguracionJuego} config
     * @param {number} veces
     * @param {string | null} titulo
     */
    function probar_generador(config, veces, titulo) {
        let h2 = window.document.createElement('h2');
        h2.textContent = titulo;
        window.document.body.append(h2);

        for (let i = 0; i < veces; i++) {
            let generador = GeneradorTableroJuego.intentar_generar(config);
            if (generador == null) {
                continue;
            } // if
            
            let tablero = new TableroJuego(config, generador.barcos, generador.tablero);
            pintar(tablero);
            
            let salto = window.document.createElement('br');
            window.document.body.append(salto);
        }
    }
});

/**
 * @param {TableroJuego} tablero
 */
function pintar(tablero) {
    let tabla = window.document.createElement('table');
    tabla.className = "tablero-juego";
    let cuerpo = window.document.createElement('tbody');
    for (let y = 0; y < tablero.alto; y++) {
        let fila = window.document.createElement('tr');
        for (let x = 0; x < tablero.ancho; x++) {
            let td = window.document.createElement('td');
            let celda = tablero.obtener_casilla(x, y);
            td.textContent = (celda == null) ? "" : celda.barco.tipo.inicial;
            td.className = ((x + y) % 2) == 0? "par" : "impar";
            if (celda != null) {
                td.classList.add("barco");
            } // if
            fila.append(td);
        } // for x
        cuerpo.append(fila);
    } // for y

    tabla.append(cuerpo);
    document.body.append(tabla);
} // pintar
