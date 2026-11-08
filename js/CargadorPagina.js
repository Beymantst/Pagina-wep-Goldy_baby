/**
 * CargadorPagina.js
 * Pantalla de carga del proyecto: cuenta la ruta del algodon desde Brasil
 * hasta Colombia. Un barco con balas de algodon navega de Santos a Cartagena
 * mientras un hilo de coser avanza como barra de progreso y el semaforo
 * aduanero pasa de rojo a verde (levante de la DIAN).
 */
class CargadorPagina {

    /** Duracion minima de la animacion, en milisegundos. */
    static INT_DURACION_MIN = 3400;

    /** Duracion minima para quien prefiere menos movimiento. */
    static INT_DURACION_REDUCIDA = 500;

    /** Espera maxima a que termine de cargar la pagina, en milisegundos. */
    static INT_ESPERA_MAX = 9000;

    /** Tiempo que dura el desvanecimiento final, en milisegundos. */
    static INT_DESVANECER = 700;

    /** Mensajes del recorrido segun el porcentaje de avance. */
    static ARR_ETAPAS = [
        { desde: 0,   canal: "rojo",     texto: "Picking cotton in Mato Grosso…" },
        { desde: 16,  canal: "rojo",     texto: "Packing the bales — Packing List ready" },
        { desde: 30,  canal: "rojo",     texto: "Loading the ship in Santos…" },
        { desde: 40,  canal: "amarillo", texto: "Sailing to Cartagena…" },
        { desde: 82,  canal: "amarillo", texto: "Certificate of Origin ✓ ACE-72 · tariff 0%" },
        { desde: 100, canal: "verde",    texto: "DIAN green channel — release granted ✓" }
    ];

    /** Porcentaje de avance en el que el barco zarpa de Santos. */
    static INT_ZARPE = 38;

    // ---------- Atributos privados ----------
    #objCargador;
    #objPuntada;
    #objAguja;
    #objEstado;
    #objPorcentaje;
    #intProgreso;
    #blnPaginaLista;
    #blnTerminado;
    #intDuracion;

    /**
     * Crea el cargador a partir de los elementos que ya existen en el HTML.
     * @param {HTMLElement} objCargador - Contenedor principal (#cargador).
     */
    constructor(objCargador) {
        this.#objCargador = objCargador;
        this.#objPuntada = objCargador.querySelector(".cargador__puntada");
        this.#objAguja = objCargador.querySelector(".cargador__aguja");
        this.#objEstado = objCargador.querySelector("#cargadorEstado");
        this.#objPorcentaje = objCargador.querySelector("#cargadorPorcentaje");
        this.#intProgreso = 0;
        this.#blnPaginaLista = document.readyState === "complete";
        this.#blnTerminado = false;
        this.#intDuracion = CargadorPagina.INT_DURACION_MIN;
    }

    // ---------- Getters y setters ----------

    /**
     * Devuelve el avance actual de la carga.
     * @returns {number} Porcentaje entre 0 y 100.
     */
    getProgreso() {
        return this.#intProgreso;
    }

    /**
     * Cambia el avance y actualiza el hilo, el texto y el semaforo.
     * @param {number} intProgreso - Porcentaje entre 0 y 100.
     */
    setProgreso(intProgreso) {
        this.#intProgreso = Math.max(0, Math.min(100, Math.round(intProgreso)));
        this.#pintar();
    }

    /**
     * Indica si la pagina ya termino de cargar sus recursos.
     * @returns {boolean} true si ya esta lista.
     */
    getPaginaLista() {
        return this.#blnPaginaLista;
    }

    /**
     * Marca la pagina como lista (o no) para poder cerrar el cargador.
     * @param {boolean} blnLista - true si la pagina ya cargo.
     */
    setPaginaLista(blnLista) {
        this.#blnPaginaLista = blnLista;
    }

    // ---------- Metodos publicos ----------

    /**
     * Arranca la animacion y, al terminar, avisa con la funcion recibida.
     * @param {Function} funcAlTerminar - Se ejecuta cuando el cargador desaparece.
     */
    iniciar(funcAlTerminar) {
        const blnReducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.#intDuracion = blnReducir ? CargadorPagina.INT_DURACION_REDUCIDA : CargadorPagina.INT_DURACION_MIN;
        this.#objCargador.style.setProperty("--dur", this.#intDuracion + "ms");
        document.body.classList.add("cargando");
        window.addEventListener("load", () => this.setPaginaLista(true));

        const intInicio = performance.now();
        const funcCuadro = (intAhora) => {
            const intTranscurrido = intAhora - intInicio;
            const fltTiempo = Math.min(intTranscurrido / this.#intDuracion, 1);
            const blnPuedeCerrar = this.#blnPaginaLista || intTranscurrido > CargadorPagina.INT_ESPERA_MAX;

            if (fltTiempo >= 1 && blnPuedeCerrar) {
                this.setProgreso(100);
                this.#terminar(funcAlTerminar);
                return;
            }
            // Sube suave y espera en 96% si la pagina todavia no termina de cargar.
            const fltAvance = (1 - Math.cos(Math.PI * fltTiempo)) / 2;
            this.setProgreso(Math.min(fltAvance * 100, 96));
            requestAnimationFrame(funcCuadro);
        };
        requestAnimationFrame(funcCuadro);
    }

    // ---------- Metodos privados ----------

    /**
     * Mueve el hilo y la aguja, avanza el barco y escribe el mensaje y el color del semaforo.
     */
    #pintar() {
        const strAncho = this.#intProgreso + "%";
        this.#objPuntada.style.width = strAncho;
        this.#objAguja.style.left = "calc(" + strAncho + " - " + (this.#intProgreso * 0.28) + "px)";
        this.#objPorcentaje.textContent = this.#intProgreso + "%";

        const objEtapa = CargadorPagina.ARR_ETAPAS.filter((objE) => this.#intProgreso >= objE.desde).pop();
        this.#objEstado.textContent = objEtapa.texto;
        const fltViaje = Math.max(0, (this.#intProgreso - CargadorPagina.INT_ZARPE) / (100 - CargadorPagina.INT_ZARPE));
        this.#objCargador.style.setProperty("--viaje", fltViaje.toFixed(3));
        this.#objCargador.setAttribute("data-canal", objEtapa.canal);
    }

    /**
     * Espera un instante con el semaforo en verde, desvanece el cargador y lo quita.
     * @param {Function} funcAlTerminar - Funcion a ejecutar al final.
     */
    #terminar(funcAlTerminar) {
        if (this.#blnTerminado) {
            return;
        }
        this.#blnTerminado = true;
        setTimeout(() => {
            this.#objCargador.classList.add("cargador--fuera");
            document.body.classList.remove("cargando");
            setTimeout(() => {
                this.#objCargador.remove();
                if (funcAlTerminar) {
                    funcAlTerminar();
                }
            }, CargadorPagina.INT_DESVANECER);
        }, 650);
    }
}
