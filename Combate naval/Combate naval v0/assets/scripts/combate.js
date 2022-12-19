// @ts-check
"use strict";

// ==========================================================================
// Definiciones de clases
// ==========================================================================

// ------------------------------------------------------------------
// Clase TipoBarco

class TipoBarco {
    /**
     * @param {string} nombre
     * @param {number} longitud
     * @param {number} cantidad
     * @param {string} inicial
     */
    constructor(nombre, longitud, cantidad, inicial) {
        // validaciones
        if (isNaN(longitud) || (longitud < 1)) throw new RangeError("longitud");
        if (isNaN(cantidad) || (cantidad < 1)) throw new RangeError("cantidad");
        if (nombre.length < 1) throw new RangeError("nombre");
        if (inicial.length < 1) throw new RangeError("inicial");

        this.nombre = nombre;
        this.longitud = longitud;
        this.cantidad = cantidad;
        this.inicial = inicial;
    } // constructor
} // class TipoBarco

// ------------------------------------------------------------------
// Clase ConfiguracionJuego

class ConfiguracionJuego {
    /**
     * @param {number} ancho
     * @param {number} alto
     * @param {TipoBarco[] | null | undefined} [flota]
     */
    constructor(ancho, alto, flota) {
        // validaciones
        if (isNaN(ancho) || (ancho < 1)) throw new RangeError("ancho");
        if (isNaN(alto) || (alto < 1)) throw new RangeError("alto");

        // flota
        if ((flota === undefined) || (flota == null)) {
            flota = ConfiguracionJuego.obtenerFlotaClasica();
        } // if
        if (flota.length < 1) throw new RangeError("flota");

        this.ancho = ancho;
        this.alto = alto;
        this.flota = flota;
    } // constructor

    /**
     * @returns {TipoBarco[]}
     */
    static obtenerFlotaClasica() {
        /** @type{TipoBarco[]} */
        let flota = [];

        flota.push(new TipoBarco("Portaviones", 4, 1, "P"));
        flota.push(new TipoBarco("Acorazado", 3, 2, "A"));
        flota.push(new TipoBarco("Crucero", 2, 3, "C"));
        flota.push(new TipoBarco("Submarino", 1, 4, "S"));

        return flota;
    } // obtenerFlotaClasica

    /**
     * @returns {TipoBarco[]}
     */
    static obtenerFlotaAmpliada() {
        /** @type{TipoBarco[]} */
        let flota = [];

        flota.push(new TipoBarco("Portaviones", 5, 2, "P"));
        flota.push(new TipoBarco("Destructor", 4, 2, "D"));
        flota.push(new TipoBarco("Acorazado", 3, 3, "A"));
        flota.push(new TipoBarco("Crucero", 2, 4, "C"));
        flota.push(new TipoBarco("Submarino", 1, 4, "S"));

        return flota;
    } // obtenerFlotaAmpliada
} // class ConfiguracionJuego

// ------------------------------------------------------------------
// Clase RectanguloBarco

class RectanguloBarco {
    /**
     * @param {number} x1
     * @param {number} x2
     * @param {number} y1
     * @param {number} y2
     */
    constructor(x1, x2, y1, y2) {
        this.modificar(x1, x2, y1, y2);
    } // constructor

    /** @type {number} */
    x1;
    /** @type {number} */
    x2;
    /** @type {number} */
    y1;
    /** @type {number} */
    y2;

    /**
     * @param {number} x1
     * @param {number} x2
     * @param {number} y1
     * @param {number} y2
     */
    modificar(x1, x2, y1, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    } // modificar
} // class RectanguloBarco

// ------------------------------------------------------------------
// Clase PosicionBarco

class PosicionBarco {
    /**
     * @param {number} x
     * @param {number} y
     * @param {boolean} vertical
     * @param {number} longitud
     */
    constructor(x, y, vertical, longitud) {
        this._x = x;
        this._y = y;
        this._vertical = vertical;
        this._longitud = longitud;
    } // constuctor

    /** @type {number} @private @readonly */
    _x;
    /** @type {number} @private @readonly */
    _y;
    /** @type {boolean} @private @readonly */
    _vertical;
    /** @type {number} @private @readonly */
    _longitud;

    /** @returns {number} */
    get x() { return this._x; }
    /** @returns {number} */
    get y() { return this._y; }
    /** @returns {boolean} */
    get vertical() { return this._vertical; }
    /** @returns {number} */
    get longitud() { return this._longitud; }

    /**
     * @param {RectanguloBarco} rectangulo
     * @returns {void}
     */
    calcular_rectangulo(rectangulo) {
        if (this.vertical) {
            rectangulo.modificar(this.x, this.x, this.y, this.y + this.longitud - 1);
        } else {
            rectangulo.modificar(this.x, this.x + this.longitud - 1, this.y, this.y);
        } // if-else
    } // calcular_rectangulo

    /**
     * @param {RectanguloBarco} rectangulo
     * @param {ConfiguracionJuego} config
     * @returns {void}
     */
    calcular_rectangulo_completo(rectangulo, config) {
        // el rectángulo completo incluye las 'aguas' a su alrededor
        if (this.vertical) {
            rectangulo.modificar(this.x - 1, this.x + 1, this.y - 1, this.y + this.longitud);
        } else {
            rectangulo.modificar(this.x - 1, this.x + this.longitud, this.y - 1, this.y + 1);
        } // if-else

        // limitar
        if (rectangulo.x1 < 0) rectangulo.x1 = 0;
        if (rectangulo.y1 < 0) rectangulo.y1 = 0;
        if (rectangulo.x2 >= config.ancho) rectangulo.x2 = config.ancho - 1;
        if (rectangulo.y2 >= config.alto) rectangulo.y2 = config.alto - 1;
    } // calcular_rectangulo_completo
} // class PosicionBarco

// ------------------------------------------------------------------
// Clase Barco

class Barco {
    /**
     * @param {TipoBarco} tipo
     * @param {PosicionBarco} posicion
     * @param {number} numero
     */
    constructor(tipo, posicion, numero) {
        this._tipo = tipo;
        this._posicion = posicion;
        this._numero = numero;
        this._disparos = new Array(tipo.longitud).fill(false);
        this._hundido = false;
    } // constuctor

    /** @type {TipoBarco} @private @readonly */
    _tipo;
    /** @type {PosicionBarco} @private @readonly */
    _posicion;
    /** @type {number} @private @readonly */
    _numero;
    /** @type {boolean} @private */
    _hundido;
    /** @type {boolean[]} @private @readonly */
    _disparos;

    /** @returns {TipoBarco} */
    get tipo() { return this._tipo; }
    /** @returns {PosicionBarco} */
    get posicion() { return this._posicion; }
    /** @returns {number} */
    get numero() { return this._numero; }
    /** @returns {boolean} */
    get hundido() { return this._hundido; }

    /**
     * @param {number} posicion
     * @returns {boolean}
     */
    esta_tocado(posicion) {
        if ((posicion < 1) || (posicion > this._tipo.longitud)) {
            throw new RangeError();
        } // if

        return this._disparos[posicion - 1];
    } // esta_tocado

    /**
     * @param {number} posicion
     * @returns {void}
     */
    disparo(posicion) {
        if ((posicion < 1) || (posicion > this._tipo.longitud)) {
            throw new RangeError();
        } // if

        this._disparos[posicion - 1] = true;

        // comprobar hundido
        this._hundido = calcular_hundido();

        function calcular_hundido() {
            for (let i = 0; i < this._tipo.longitud; i++) {
                if (!this._disparos[i]) return false;
            } // for i

            return true;
        } // calcular_hundido
    } // disparo

    /**
     * @returns {void}
     */
    reset() {
        this._hundido = false;
        for (let i = 0; i < this._disparos.length; i++) {
            this._disparos[i] = false;
        } // for
    } // reset
} // class Barco

// ------------------------------------------------------------------
// Clase BarcoTablero

class BarcoTablero {
    /**
     * @param {Barco} barco
     * @param {number} posicion
     */
    constructor(barco, posicion) {
        this._barco = barco;
        this._posicion = posicion;
    } // constructor

    /** @type {Barco} @private @readonly */
    _barco;
    /** @type {number} @private @readonly */
    _posicion;

    /** @returns {Barco} */
    get barco() { return this._barco; }
    /** @returns {number} */
    get posicion() { return this._posicion; }

    /**
     * @returns {void}
     */
    reset() {
        this._barco.reset();
    } // reset
} // class BarcoTablero

// ------------------------------------------------------------------
// Clase TableroJuego

class TableroJuego extends Object {
    /**
     * @param {ConfiguracionJuego} config
     * @param {Barco[]} barcos
     * @param {Array<BarcoTablero | null>[]} tablero
     */
    constructor(config, barcos, tablero) {
        super();
        this._ancho = config.ancho;
        this._alto = config.alto;
        this._barcos = barcos;
        this._tablero = tablero;
    } // constructor

    /** @type {Barco[]} @private @readonly */
    _barcos;
    /** @type {Array<BarcoTablero | null>[]} @private @readonly */
    _tablero;
    /** @type {number} @private @readonly */
    _ancho;
    /** @type {number} @private @readonly */
    _alto;

    /** @returns {number} */
    get ancho() { return this._ancho; }
    /** @returns {number} */
    get alto() { return this._alto; }
    /** @returns {number} */
    get numero_barcos() { return this._barcos.length; }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {BarcoTablero | null}
     */
    obtener_casilla(x, y) {
        if ((y < 0) || (y >= this._tablero.length)) throw new RangeError();
        if ((x < 0) || (x >= this._tablero.length)) throw new RangeError();

        return this._tablero[y][x];
    } // obtener_casilla

    /**
     * @param {number} indice 
     * @returns {Barco}
     */
    obtener_barco(indice) {
        if ((indice < 0) || (indice >= this.numero_barcos)) throw new RangeError();

        return this._barcos[indice];
    } // obtener_barco

    /**
     * @override
     * @returns {string}
     */
    toString() {
        let resultado = "";

        for (let y = 0; y < this._tablero.length; y++) {
            if (y > 0) resultado += "\r\n";
            for (let x = 0; x < this._tablero[y].length; x++) {
                resultado += this._tablero[y][x] == null ? "." : this._tablero[y][x]?.barco.tipo.inicial;
            } // for x
        } // for y

        return resultado;
    } // toString
} // class TableroJuego

// ------------------------------------------------------------------
// Clase GeneradorTableroJuego

class GeneradorTableroJuego {
    /**
     * @param {ConfiguracionJuego} config
     * @private
     */
    constructor(config) {
        this._config = config;
        this._inicializar_generador();
    } // constructor

    /** @returns {Barco[]} @readonly */
    get barcos() { return this._barcos; }
    /** @type {Array<BarcoTablero | null>[]} @readonly */
    get tablero() { return this._tablero; }

    /** @type {ConfiguracionJuego} @private @readonly */
    _config;
    /** @type {Barco[]} @private */
    _barcos;
    /** @type {Array<BarcoTablero | null>[]} @private */
    _tablero;

    // variables "temporales" durante la generacion
    /** @type {PosicionBarco} @private */
    _posicion;
    /** @type {RectanguloBarco} @private */
    _rectangulo;
    /** @type {RectanguloBarco} @private */
    _rectangulo_completo;
    /** @type {boolean[][]} @private */
    _ocupado;

    /**
     * @param {ConfiguracionJuego} config
     * @param {number | undefined} [intentos]
     * @returns {GeneradorTableroJuego | null}
     */
    static intentar_generar(config, intentos) {
        if ((intentos === undefined) || (intentos < 1)) {
            intentos = 100;
        } // if

        let generador = new GeneradorTableroJuego(config);
        for (let intento = 0; intento < intentos; intento++) {
            generador._reset();
            if (generador._generar()) return generador;
        } // for intento

        return null;
    } // intentar_generar

    /**
     * @private
     * @returns (Array<BarcoTablero | null>[]}
     */
    _inicializar_tablero_seguro() {
        let contador = 0;
        while (contador < 1000) {
            let tablero = this._generar();
            if (tablero != null) return tablero;
            contador++;
        } // while

        throw new Error("Imposible inicializar el tablero; número de intentos excedido");
    } // _inicializar_tablero_seguro

    /**
     * @private
     * @returns {void}
     */
    _inicializar_generador() {
        this._rectangulo = new RectanguloBarco(NaN, NaN, NaN, NaN);
        this._rectangulo_completo = new RectanguloBarco(NaN, NaN, NaN, NaN);

        // el tablero que vamos a construir
        this._tablero = new Array(this._config.alto);
        // matriz auxiliar para buscar huecos libres
        this._ocupado = new Array(this._config.alto);

        for (let y = 0; y < this._config.alto; y++) {
            this._tablero[y] = new Array(this._config.ancho);
            this._ocupado[y] = new Array(this._config.ancho);
        } // for y

        this._barcos = [];
    } // _inicializar_generador

    /**
     * @private
     * @returns {void}
     */
    _reset() {
        this._rectangulo.modificar(NaN, NaN, NaN, NaN);
        this._rectangulo_completo.modificar(NaN, NaN, NaN, NaN);
        this._barcos.length = 0;

        for (let y = 0; y < this._config.alto; y++) {
            for (let x = 0; x < this._config.ancho; x++) {
                this._tablero[y][x] = null;
                this._ocupado[y][x] = false;
            } // for x
        } // for y

        // marcamos las 4 esquinas como no disponibles
        this._ocupado[0][0] = true;
        this._ocupado[0][this._config.ancho - 1] = true;
        this._ocupado[this._config.alto - 1][0] = true;
        this._ocupado[this._config.alto - 1][this._config.ancho - 1] = true;
    } // _reset

    /**
     * @private
     * @returns {boolean}
     */
    _generar() {
        // para cada tipo de barco en la "flota"
        let numero = 0;
        for (let tipo of this._config.flota) {
            // para cada barco del tipo
            for (let i = 0; i < tipo.cantidad; i++) {
                numero++;
                if (!this._obtener_posicion_valida(tipo.longitud)) return false;

                let barco = new Barco(tipo, this._posicion, numero);
                this._guardar_barco(barco);
            } // for i
        } // for tipo

        return true;
    } // _generar

    /**
     * @private
     * @param {number} longitud
     */
    _obtener_posicion_valida(longitud) {
        // obtenemos una posición válida
        let contador = 0;
        while (true) {
            this._posicion = new PosicionBarco(
                obtener_numero_aleatorio(1, this._config.ancho) - 1,
                obtener_numero_aleatorio(1, this._config.alto) - 1,
                (longitud == 1) ? false : Math.random() >= 0.5,
                longitud);
            this._posicion.calcular_rectangulo(this._rectangulo);
            this._posicion.calcular_rectangulo_completo(this._rectangulo_completo, this._config);

            if (this._validar_posicion()) return true;

            // excedido el número de intentos?
            contador++;
            if (contador > 1000) return false;
        } // while
    } // obtener_posicion_valida

    /**
     * @private
     * @returns {boolean}
     */
    _validar_posicion() {
        // la casilla de inicio está libre?
        if (this._ocupado[this._posicion.y][this._posicion.x]) return false;

        // cabe?
        if (this._rectangulo.x2 >= this._config.ancho) return false;
        if (this._rectangulo.y2 >= this._config.alto) return false;

        // está pegado al borde?
        if (this._posicion.longitud > 1) {
            if (this._posicion.vertical) {
                if ((this._posicion.x == 0) || (this._posicion.x == (this._config.ancho - 1))) return false;
            } else {
                if ((this._posicion.y == 0) || (this._posicion.y == (this._config.alto - 1))) return false;
            } // if-else
        } // if-else

        // validamos si el rectangulo completo del barco está libre
        for (let y = this._rectangulo_completo.y1; y <= this._rectangulo_completo.y2; y++) {
            for (let x = this._rectangulo_completo.x1; x <= this._rectangulo_completo.x2; x++) {
                if (this._ocupado[y][x]) return false;
            } // for x
        } // for y

        return true;
    } // validar_barco

    /**
     * @private
     * @param {Barco} barco
     */
    _guardar_barco(barco) {
        // colocar en el tablero y marcar como ocupado
        let posicion = 1;
        for (let y = this._rectangulo.y1; y <= this._rectangulo.y2; y++) {
            for (let x = this._rectangulo.x1; x <= this._rectangulo.x2; x++) {
                this._tablero[y][x] = new BarcoTablero(barco, posicion++);
                this._ocupado[y][x] = true;
            } // for x
        } // for y

        this._barcos.push(barco);
    } // guardar_barco
} // class TableroJuego

/**
 * @param {number} minimo 
 * @param {number} maximo 
 * @returns {number} 
 */
function obtener_numero_aleatorio(minimo, maximo) {
    let rango = (maximo - minimo) + 1;
    let random = Math.random();
    let aleatorio = Math.trunc(random * rango) + minimo;

    return aleatorio;
} // obtener_numero_aleatorio
