const usuario = localStorage.getItem("usuario");

if (!usuario) {
  window.location.href = "login.html";  // Redirige a la página de login si no está autenticado
}
// Código actualizado con las soluciones
const filas = 6;
const columnas = 7;
const tablero = [];
let turnoJugador = true;

const contenedorTablero = document.getElementById('tablero');
const mensaje = document.getElementById('mensaje');
const botonReiniciar = document.getElementById('reiniciar');

function crearTablero() {
  contenedorTablero.innerHTML = '';
  for (let i = 0; i < filas; i++) {
    tablero[i] = [];
    for (let j = 0; j < columnas; j++) {
      tablero[i][j] = null;
      const celda = document.createElement('div');
      celda.classList.add('celda');
      celda.dataset.fila = i;
      celda.dataset.columna = j;
      celda.addEventListener('click', () => jugar(j));
      contenedorTablero.appendChild(celda);
    }
  }
}

function jugar(columna) {
  if (!turnoJugador) return;
  for (let fila = filas - 1; fila >= 0; fila--) {
    if (!tablero[fila][columna]) {
      tablero[fila][columna] = 'jugador';
      actualizarTablero(fila, columna, 'jugador');
      if (verificarGanador('jugador')) {
        mensaje.textContent = '¡Ganaste!';
        bloquearTablero();
        return;
      }
      turnoJugador = false;
      setTimeout(turnoCPU, 500);
      return;
    }
  }
  mensaje.textContent = 'Columna llena. Elige otra.';
}

function turnoCPU() {
  if (tablero.flat().every((celda) => celda !== null)) {
    mensaje.textContent = 'Empate. ¡No hay más movimientos posibles!';
    return;
  }

  let columna;
  do {
    columna = Math.floor(Math.random() * columnas);
  } while (tablero[0][columna] !== null);

  for (let fila = filas - 1; fila >= 0; fila--) {
    if (!tablero[fila][columna]) {
      tablero[fila][columna] = 'cpu';
      actualizarTablero(fila, columna, 'cpu');
      if (verificarGanador('cpu')) {
        mensaje.textContent = 'La CPU ganó. ¡Suerte la próxima vez!';
        bloquearTablero();
        return;
      }
      turnoJugador = true;
      return;
    }
  }
}

function actualizarTablero(fila, columna, jugador) {
  const celdas = document.querySelectorAll('.celda');
  celdas.forEach((celda) => {
    if (celda.dataset.fila == fila && celda.dataset.columna == columna) {
      celda.classList.add(jugador);
    }
  });
}

function verificarGanador(jugador) {
  // Verifica todas las direcciones: horizontal, vertical, diagonal derecha y diagonal izquierda
  return (
    verificarDirecciones(jugador, 0, 1) || // Horizontal
    verificarDirecciones(jugador, 1, 0) || // Vertical
    verificarDirecciones(jugador, 1, 1) || // Diagonal hacia abajo derecha
    verificarDirecciones(jugador, 1, -1)   // Diagonal hacia abajo izquierda
  );
}

function verificarDirecciones(jugador, dirFila, dirColumna) {
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      // Asegúrate de no salirte del tablero al calcular las posiciones futuras
      if (
        i + 3 * dirFila < filas &&
        i + 3 * dirFila >= 0 &&
        j + 3 * dirColumna < columnas &&
        j + 3 * dirColumna >= 0
      ) {
        // Verifica si hay 4 fichas consecutivas del mismo jugador
        if (
          tablero[i][j] === jugador &&
          tablero[i + dirFila][j + dirColumna] === jugador &&
          tablero[i + 2 * dirFila][j + 2 * dirColumna] === jugador &&
          tablero[i + 3 * dirFila][j + 3 * dirColumna] === jugador
        ) {
          return true;
        }
      }
    }
  }
  return false;
}


function bloquearTablero() {
  document.querySelectorAll('.celda').forEach((celda) => {
    celda.replaceWith(celda.cloneNode(true));
  });
}

botonReiniciar.addEventListener('click', () => {
  turnoJugador = true;
  mensaje.textContent = '';
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      tablero[i][j] = null;
    }
  }
  crearTablero();
});

crearTablero();

document.querySelector("header h1").addEventListener("click", () => {
  window.location.href = "/index.html";
});
