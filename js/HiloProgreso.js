/**
 * HiloProgreso.js
 * Hilo de coser fijo arriba de la pagina: una aguja lo va "cosiendo" a medida
 * que la persona baja por el sitio (el oficio de GoldyBaby: ropa para bebes).
 */
class HiloProgreso {

    // ---------- Atributos privados ----------
    #objHilo;
    #fltAvance;

    /**
     * Crea el hilo de progreso.
     * @param {HTMLElement} objHilo - Elemento #hiloProgreso del HTML.
     */
    constructor(objHilo) {
        this.#objHilo = objHilo;
        this.#fltAvance = 0;
    }

    // ---------- Getters y setters ----------

    /**
     * Devuelve cuanto se ha recorrido de la pagina.
     * @returns {number} Porcentaje entre 0 y 100.
     */
    getAvance() {
        return this.#fltAvance;
    }

    /**
     * Cambia el avance del hilo y lo dibuja.
     * @param {number} fltAvance - Porcentaje entre 0 y 100.
     */
    setAvance(fltAvance) {
        this.#fltAvance = Math.max(0, Math.min(100, fltAvance));
        this.#objHilo.style.setProperty("--avance", this.#fltAvance.toFixed(2));
    }

    // ---------- Metodos publicos ----------

    /**
     * Conecta el scroll y el cambio de tamano de la ventana.
     */
    iniciar() {
        window.addEventListener("scroll", () => this.calcular(), { passive: true });
        window.addEventListener("resize", () => this.calcular());
        this.calcular();
    }

    /**
     * Calcula que porcentaje de la pagina se ha recorrido.
     */
    calcular() {
        const intRecorrible = document.documentElement.scrollHeight - window.innerHeight;
        this.setAvance(intRecorrible > 0 ? (window.scrollY / intRecorrible) * 100 : 0);
    }
}
