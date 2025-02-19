document.addEventListener('DOMContentLoaded', () => {
  const usuario = localStorage.getItem("usuario");

  if (!usuario) {
    window.location.href = "login.html";  
    return;
  }

  let tablero = Array(9).fill(null);
  let turno = 'X';
  let contraCPU = true;

  function actualizarTablero() {
    document.querySelectorAll('.celda').forEach((celda, index) => {
      celda.textContent = tablero[index];
      celda.classList.remove('rojo', 'azul');
      if (tablero[index] === 'X') {
        celda.classList.add('rojo');
      } else if (tablero[index] === 'O') {
        celda.classList.add('azul');
      }
    });

    const ganador = verificarGanador();
    const mensajeElemento = document.getElementById('mensaje');

    if (ganador) {
      mensajeElemento.textContent =
        ganador === 'Empate' ? '¡Es un empate!' : `¡Ganó ${ganador}!`;
      return;
    }

    mensajeElemento.textContent = turno === 'X' ? 'Tu turno' : 'Turno de la CPU';
  }

  function verificarGanador() {
    const combinacionesGanadoras = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of combinacionesGanadoras) {
      if (tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]) {
        return tablero[a]; 
      }
    }

    return tablero.every((celda) => celda) ? 'Empate' : null;
  }

  function movimientoCPU() {
    const movimientosDisponibles = tablero
      .map((celda, index) => (celda === null ? index : null))
      .filter((x) => x !== null);
    
    return movimientosDisponibles.length > 0 
      ? movimientosDisponibles[Math.floor(Math.random() * movimientosDisponibles.length)]
      : null;
  }

  document.querySelectorAll('.celda').forEach((celda, index) => {
    celda.addEventListener('click', () => {
      if (!tablero[index] && turno === 'X') {
        tablero[index] = 'X';
        turno = 'O';

        if (!verificarGanador() && contraCPU) {
          const movimiento = movimientoCPU();
          if (movimiento !== null) {
            tablero[movimiento] = 'O';
            turno = 'X';
          }
        }

        actualizarTablero();
      }
    });
  });

  // 🔹 Asegurar que reiniciarJuego esté disponible globalmente
  window.reiniciarJuego = function () {
    tablero = Array(9).fill(null);
    turno = 'X';
    actualizarTablero();
    document.getElementById('mensaje').textContent = 'Tu turno';
  };

  actualizarTablero();
  
  document.querySelector("header h1").addEventListener("click", () => {
    window.location.href = "/index.html";
  });
});
