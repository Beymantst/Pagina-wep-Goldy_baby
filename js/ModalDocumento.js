/**
 * ModalDocumento.js
 * Ventana emergente ("modal") que muestra un documento por encima de la
 * pagina, sin abrir otra pestana. El contenido de cada documento vive en un
 * <template> del HTML y se copia dentro de la ventana al abrirla.
 */
class ModalDocumento {

    /** Clase CSS que hace visible la ventana. */
    static STR_CLASE_ABIERTO = "modal--abierto";

    /** Clase CSS del body mientras la ventana esta abierta (bloquea el scroll). */
    static STR_CLASE_BODY = "modal-activo";

    /** Clase CSS mientras el pergamino se enrolla para cerrarse. */
    static STR_CLASE_CERRANDO = "modal--cerrando";

    /** Milisegundos que tarda el pergamino en enrollarse. */
    static INT_MS_CIERRE = 460;

    // ---------- Atributos privados ----------
    #objVentana;
    #objCaja;
    #objTitulo;
    #objContenido;
    #objUltimoFoco;
    #blnAbierto;
    #blnCerrando;

    /**
     * Crea el modal a partir de los elementos que ya existen en el HTML.
     * @param {HTMLElement} objVentana - Contenedor principal (#modalDocumento).
     */
    constructor(objVentana) {
        this.#objVentana = objVentana;
        this.#objCaja = objVentana.querySelector(".modal__caja");
        this.#objTitulo = objVentana.querySelector("#modalTitulo");
        this.#objContenido = objVentana.querySelector("#modalContenido");
        this.#objUltimoFoco = null;
        this.#blnAbierto = false;
        this.#blnCerrando = false;
    }

    // ---------- Getters y setters ----------

    /**
     * Indica si la ventana esta abierta.
     * @returns {boolean} true si esta abierta.
     */
    getAbierto() {
        return this.#blnAbierto;
    }

    /**
     * Abre o cierra la ventana y actualiza su aspecto y accesibilidad.
     * @param {boolean} blnAbierto - true para abrir, false para cerrar.
     */
    setAbierto(blnAbierto) {
        this.#blnAbierto = blnAbierto;
        this.#objVentana.classList.toggle(ModalDocumento.STR_CLASE_ABIERTO, blnAbierto);
        this.#objVentana.setAttribute("aria-hidden", String(!blnAbierto));
        document.body.classList.toggle(ModalDocumento.STR_CLASE_BODY, blnAbierto);
    }

    // ---------- Metodos publicos ----------

    /**
     * Conecta los eventos: botones que abren documentos (data-documento),
     * elementos que cierran (data-cerrar-modal) y la tecla Escape.
     */
    iniciar() {
        document.querySelectorAll("[data-documento]").forEach((objBoton) => {
            objBoton.addEventListener("click", () => {
                this.abrir(objBoton.dataset.documento, objBoton);
            });
        });

        this.#objVentana.querySelectorAll("[data-cerrar-modal]").forEach((objElemento) => {
            objElemento.addEventListener("click", () => this.cerrar());
        });

        document.addEventListener("keydown", (objEvento) => this.#alPulsarTecla(objEvento));
    }

    /**
     * Muestra un documento en la ventana.
     * @param {string} strIdPlantilla - id del <template> con el documento.
     * @param {HTMLElement} objOrigen - Boton que lo abrio (para devolverle el foco al cerrar).
     */
    abrir(strIdPlantilla, objOrigen) {
        const objPlantilla = document.getElementById(strIdPlantilla);
        if (!objPlantilla) {
            return;
        }
        this.#objUltimoFoco = objOrigen || null;
        this.#objTitulo.textContent = objPlantilla.dataset.titulo || "Document";
        this.#objContenido.replaceChildren(objPlantilla.content.cloneNode(true));
        this.#objContenido.scrollTop = 0;
        this.setAbierto(true);
        this.#objCaja.focus();
    }

    /**
     * Enrolla el pergamino y cierra la ventana. Si la persona prefiere menos
     * movimiento, la cierra de inmediato.
     */
    cerrar() {
        if (!this.#blnAbierto || this.#blnCerrando) {
            return;
        }
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            this.#terminarCierre();
            return;
        }
        this.#blnCerrando = true;
        this.#objVentana.classList.add(ModalDocumento.STR_CLASE_CERRANDO);
        setTimeout(() => this.#terminarCierre(), ModalDocumento.INT_MS_CIERRE);
    }

    // ---------- Metodos privados ----------

    /**
     * Oculta la ventana, limpia el contenido y devuelve el foco al boton de origen.
     */
    #terminarCierre() {
        this.#blnCerrando = false;
        this.#objVentana.classList.remove(ModalDocumento.STR_CLASE_CERRANDO);
        this.setAbierto(false);
        this.#objContenido.replaceChildren();
        if (this.#objUltimoFoco) {
            this.#objUltimoFoco.focus();
        }
    }

    /**
     * Cierra la ventana cuando se pulsa Escape.
     * @param {KeyboardEvent} objEvento - Evento de teclado.
     */
    #alPulsarTecla(objEvento) {
        if (objEvento.key === "Escape" && this.#blnAbierto) {
            this.cerrar();
        }
    }
}
