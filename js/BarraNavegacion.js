/**
 * BarraNavegacion.js
 * Controla el encabezado fijo de la pagina: el cambio de apariencia al hacer
 * scroll, el menu movil (hamburguesa) y el desplazamiento suave a cada seccion.
 */
class BarraNavegacion {

    /** Clases del encabezado cuando la pagina esta arriba del todo. */
    static STR_CLASES_ARRIBA = ["bg-transparent", "py-4"];

    /** Clases del encabezado cuando el usuario ya hizo scroll. */
    static STR_CLASES_SCROLL = [
        "bg-[#FFF9F0]/85", "backdrop-blur-xl",
        "shadow-[0_8px_30px_rgba(0,0,0,0.06)]", "py-3"
    ];

    /** Clases extra de las dos lineas de la hamburguesa cuando el menu esta abierto. */
    static ARR_CLASES_LINEA_1 = ["rotate-45", "translate-y-1"];
    static ARR_CLASES_LINEA_2 = ["-rotate-45", "-translate-y-1"];

    /** Pixeles de scroll a partir de los cuales el encabezado cambia. */
    static INT_UMBRAL_SCROLL = 20;

    // ---------- Atributos privados ----------
    #objEncabezado;
    #objMenuMovil;
    #objBotonMenu;
    #arrLineasMenu;
    #blnMenuAbierto;
    #blnDesplazado;

    /**
     * Crea la barra de navegacion.
     * @param {HTMLElement} objEncabezado - Elemento <header> de la pagina.
     * @param {HTMLElement} objMenuMovil - Contenedor del menu desplegable movil.
     * @param {HTMLElement} objBotonMenu - Boton de hamburguesa.
     */
    constructor(objEncabezado, objMenuMovil, objBotonMenu) {
        this.#objEncabezado = objEncabezado;
        this.#objMenuMovil = objMenuMovil;
        this.#objBotonMenu = objBotonMenu;
        this.#arrLineasMenu = objBotonMenu.querySelectorAll(".linea-menu");
        this.#blnMenuAbierto = false;
        this.#blnDesplazado = false;
    }

    // ---------- Getters y setters ----------

    /**
     * Indica si el menu movil esta abierto.
     * @returns {boolean} true si esta abierto.
     */
    getMenuAbierto() {
        return this.#blnMenuAbierto;
    }

    /**
     * Abre o cierra el menu movil y actualiza su apariencia.
     * @param {boolean} blnAbierto - true para abrirlo, false para cerrarlo.
     */
    setMenuAbierto(blnAbierto) {
        this.#blnMenuAbierto = blnAbierto;
        this.#pintarMenu();
    }

    /**
     * Indica si la pagina esta desplazada respecto al inicio.
     * @returns {boolean} true si el scroll supera el umbral.
     */
    getDesplazado() {
        return this.#blnDesplazado;
    }

    /**
     * Cambia el estado de desplazamiento y actualiza el encabezado.
     * @param {boolean} blnDesplazado - true si la pagina ya esta desplazada.
     */
    setDesplazado(blnDesplazado) {
        this.#blnDesplazado = blnDesplazado;
        this.#pintarEncabezado();
    }

    // ---------- Metodos publicos ----------

    /**
     * Conecta todos los eventos: scroll de la ventana, boton de hamburguesa y
     * cada boton que tenga el atributo data-destino.
     */
    iniciar() {
        window.addEventListener("scroll", () => this.revisarScroll());
        this.#objBotonMenu.addEventListener("click", () => this.alternarMenu());

        document.querySelectorAll("[data-destino]").forEach((objBoton) => {
            objBoton.addEventListener("click", () => {
                this.irASeccion(objBoton.dataset.destino);
            });
        });

        this.revisarScroll();
    }

    /**
     * Compara la posicion de scroll con el umbral y actualiza el estado.
     */
    revisarScroll() {
        this.setDesplazado(window.scrollY > BarraNavegacion.INT_UMBRAL_SCROLL);
    }

    /**
     * Abre el menu movil si esta cerrado y lo cierra si esta abierto.
     */
    alternarMenu() {
        this.setMenuAbierto(!this.#blnMenuAbierto);
    }

    /**
     * Cierra el menu movil y baja con animacion suave hasta una seccion.
     * @param {string} strIdDestino - id de la seccion a la que se quiere ir.
     */
    irASeccion(strIdDestino) {
        this.setMenuAbierto(false);
        const objSeccion = document.getElementById(strIdDestino);
        if (objSeccion) {
            objSeccion.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    // ---------- Metodos privados ----------

    /**
     * Aplica al encabezado las clases de "arriba" o de "con scroll".
     */
    #pintarEncabezado() {
        const arrQuitar = this.#blnDesplazado ? BarraNavegacion.STR_CLASES_ARRIBA : BarraNavegacion.STR_CLASES_SCROLL;
        const arrPoner = this.#blnDesplazado ? BarraNavegacion.STR_CLASES_SCROLL : BarraNavegacion.STR_CLASES_ARRIBA;
        this.#objEncabezado.classList.remove(...arrQuitar);
        this.#objEncabezado.classList.add(...arrPoner);
    }

    /**
     * Muestra u oculta el menu movil y gira las lineas de la hamburguesa
     * para formar una X cuando esta abierto.
     */
    #pintarMenu() {
        this.#objMenuMovil.classList.toggle("hidden", !this.#blnMenuAbierto);
        this.#objBotonMenu.setAttribute("aria-expanded", String(this.#blnMenuAbierto));
        this.#arrLineasMenu[0].classList.toggle("rotate-45", this.#blnMenuAbierto);
        this.#arrLineasMenu[0].classList.toggle("translate-y-1", this.#blnMenuAbierto);
        this.#arrLineasMenu[1].classList.toggle("-rotate-45", this.#blnMenuAbierto);
        this.#arrLineasMenu[1].classList.toggle("-translate-y-1", this.#blnMenuAbierto);
    }
}
