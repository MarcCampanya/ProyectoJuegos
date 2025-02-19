const tablero = document.getElementById("tablero");
const reiniciarBtn = document.getElementById("reiniciar");
const mensaje = document.getElementById("mensaje");

let cartas = [];
let primeraCarta = null;
let segundaCarta = null;
let bloquearTablero = false;

// Crear un arreglo de cartas con pares (usando imágenes en PNG)
  function generarCartas() {
    const valores = [
      "/imagenes/imagen1.png",
      "/imagenes/imagen2.png",
      "/imagenes/imagen3.png",
      "/imagenes/imagen4.png",
      "/imagenes/imagen5.png",
      "/imagenes/imagen6.png",
      "/imagenes/imagen7.png",
      "/imagenes/imagen8.png",
    ];
    const pares = [...valores, ...valores]; // Crear pares
    return pares.sort(() => Math.random() - 0.5); // Mezclar las cartas
  }

// Construir el tablero de cartas
function construirTablero() {
  cartas = generarCartas();
  tablero.innerHTML = ""; // Limpiar el tablero
  mensaje.textContent = ""; // Limpiar el mensaje de victoria

  cartas.forEach((valor, index) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.valor = valor;

    const reverso = document.createElement("div");
    reverso.classList.add("reverso"); // Parte trasera de la carta
    carta.appendChild(reverso);

    const frente = document.createElement("img");
    frente.classList.add("frente"); // Parte frontal de la carta
    frente.src = valor;  // Aquí ya tiene la ruta correcta en PNG
    frente.alt = "Carta";
    carta.appendChild(frente);

    carta.addEventListener("click", () => girarCarta(carta));
    tablero.appendChild(carta);
  });
}

// Girar carta
function girarCarta(carta) {
  if (bloquearTablero || carta.classList.contains("volteada")) return;

  carta.classList.add("volteada");

  if (!primeraCarta) {
    primeraCarta = carta;
  } else {
    segundaCarta = carta;
    verificarPareja();
  }
}

// Verificar si hay una pareja
function verificarPareja() {
  bloquearTablero = true;

  const esPareja = primeraCarta.dataset.valor === segundaCarta.dataset.valor;
  setTimeout(() => {
    if (esPareja) {
      primeraCarta.removeEventListener("click", girarCarta);
      segundaCarta.removeEventListener("click", girarCarta);
    } else {
      primeraCarta.classList.remove("volteada");
      segundaCarta.classList.remove("volteada");
    }

    primeraCarta = null;
    segundaCarta = null;
    bloquearTablero = false;

    verificarFinDelJuego();
  }, 1000);
}

// Verificar si el juego ha terminado
function verificarFinDelJuego() {
  const cartasRestantes = document.querySelectorAll(".carta:not(.volteada)");
  if (cartasRestantes.length === 0) {
    mensaje.textContent = "¡Felicidades! Has completado el juego.";
  }
}

// Reiniciar juego
function reiniciarJuego() {
  primeraCarta = null;
  segundaCarta = null;
  bloquearTablero = false;
  construirTablero();
}

// Inicializar el juego
reiniciarBtn.addEventListener("click", reiniciarJuego);
construirTablero();

document.querySelector("header h1").addEventListener("click", () => {
  window.location.href = "/index.html";
});
