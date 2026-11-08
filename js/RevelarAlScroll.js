/**
 * RevelarAlScroll.js
 * Hace que las secciones aparezcan suavemente al llegar a ellas. Las tarjetas
 * de documentos de importacion llegan "selladas", como un sello de la DIAN.
 */
class RevelarAlScroll {

    /** Clase que deja el elemento oculto antes de aparecer. */
    static STR_CLASE_BASE = "revela";

    /** Clase de las tarjetas que llegan con efecto de sello. */
    static STR_CLASE_SELLO = "revela--sello";

    /** Clase que muestra el elemento. */
    static STR_CLASE_VISIBLE = "revela--visible";

    /** Elementos que aparecen con desvanecido suave. */
    static STR_SELECTOR_SECCIONES = "#home > .relative, section[id]:not(#home):not(#imports) > div:not(.absolute)";

    /** Tarjetas de documentos que aparecen con efecto de sello. */
    static STR_SELECTOR_SELLOS = "#imports .grid > div";

    // ---------- Atributos privados ----------
    #objObservador;

    /**
     * Crea el revelador. No hace nada hasta llamar a iniciar().
     */
    constructor() {
        this.#objObservador = null;
    }

    // ---------- Metodos publicos ----------

    /**
     * Marca los elementos y empieza a vigilar cuando entran en pantalla.
     */
    iniciar() {
        if (!("IntersectionObserver" in window)) {
            return;
        }
        this.#objObservador = new IntersectionObserver((arrEntradas) => this.#alCruzar(arrEntradas), {
            threshold: 0.08,
            rootMargin: "0px 0px -6% 0px"
        });

        document.querySelectorAll(RevelarAlScroll.STR_SELECTOR_SECCIONES).forEach((objElemento) => {
            this.#registrar(objElemento, false, 0);
        });
        document.querySelectorAll(RevelarAlScroll.STR_SELECTOR_SELLOS).forEach((objElemento) => {
            const intPosicion = Array.from(objElemento.parentElement.children).indexOf(objElemento);
            this.#registrar(objElemento, true, intPosicion);
        });
    }

    // ---------- Metodos privados ----------

    /**
     * Prepara un elemento para aparecer cuando se vea.
     * @param {HTMLElement} objElemento - Elemento a revelar.
     * @param {boolean} blnSello - true si usa el efecto de sello.
     * @param {number} intPosicion - Lugar entre sus hermanos (escalona la entrada).
     */
    #registrar(objElemento, blnSello, intPosicion) {
        objElemento.classList.add(blnSello ? RevelarAlScroll.STR_CLASE_SELLO : RevelarAlScroll.STR_CLASE_BASE);
        objElemento.style.setProperty("--i", String(intPosicion));
        this.#objObservador.observe(objElemento);
    }

    /**
     * Muestra los elementos que entran en pantalla (o que ya quedaron arriba).
     * @param {IntersectionObserverEntry[]} arrEntradas - Cambios detectados.
     */
    #alCruzar(arrEntradas) {
        arrEntradas.forEach((objEntrada) => {
            const blnYaPasado = objEntrada.boundingClientRect.top < 0;
            if (objEntrada.isIntersecting || blnYaPasado) {
                objEntrada.target.classList.add(RevelarAlScroll.STR_CLASE_VISIBLE);
                this.#objObservador.unobserve(objEntrada.target);
            }
        });
    }
}
