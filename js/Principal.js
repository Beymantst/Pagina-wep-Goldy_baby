/**
 * Principal.js
 * Punto de entrada: cuando la pagina termina de cargar, crea la barra de
 * navegacion, la ventana de documentos, el hilo de progreso y el cargador
 * del proyecto, y los inicia.
 */

/**
 * Crea e inicia todas las piezas de la pagina.
 */
function iniciarPagina() {
    const objEncabezado = document.getElementById("encabezado");
    const objMenuMovil = document.getElementById("menuMovil");
    const objBotonMenu = document.getElementById("botonMenu");
    const objBarra = new BarraNavegacion(objEncabezado, objMenuMovil, objBotonMenu);
    objBarra.iniciar();

    const objVentana = document.getElementById("modalDocumento");
    const objModal = new ModalDocumento(objVentana);
    objModal.iniciar();

    const objHilo = new HiloProgreso(document.getElementById("hiloProgreso"));
    objHilo.iniciar();

    const objRevelador = new RevelarAlScroll();
    const objElementoCargador = document.getElementById("cargador");
    if (objElementoCargador) {
        const objCargador = new CargadorPagina(objElementoCargador);
        objCargador.iniciar(() => objRevelador.iniciar());
    } else {
        objRevelador.iniciar();
    }
}

document.addEventListener("DOMContentLoaded", iniciarPagina);
