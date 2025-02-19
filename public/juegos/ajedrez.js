let turno = 'B';

function cambiarTurno() {
    turno = turno === 'B' ? 'N' : 'B';
    actualizarIndicadorTurno();
}

function actualizarIndicadorTurno() {
    const indicador = document.getElementById('turno-indicador');
    indicador.textContent = `Turno de: ${turno === 'B' ? 'Blancas' : 'Negras'}`;
}

document.addEventListener("DOMContentLoaded", actualizarIndicadorTurno);

const piezas = {
    'peonB': '♙', 'torreB': '♖', 'caballoB': '♘', 'alfilB': '♗', 'reinaB': '♕', 'reyB': '♔',
    'peonN': '♟', 'torreN': '♜', 'caballoN': '♞', 'alfilN': '♝', 'reinaN': '♛', 'reyN': '♚'
};

const posicionInicial = [
    ['torreN', 'caballoN', 'alfilN', 'reinaN', 'reyN', 'alfilN', 'caballoN', 'torreN'],
    ['peonN', 'peonN', 'peonN', 'peonN', 'peonN', 'peonN', 'peonN', 'peonN'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['peonB', 'peonB', 'peonB', 'peonB', 'peonB', 'peonB', 'peonB', 'peonB'],
    ['torreB', 'caballoB', 'alfilB', 'reinaB', 'reyB', 'alfilB', 'caballoB', 'torreB']
];

const tablero = document.getElementById('tablero');
let seleccionada = null;
let partidaTerminada = false;

const mapeoPiezas = {
    '♙': 'peonB', '♟': 'peonN',
    '♖': 'torreB', '♜': 'torreN',
    '♘': 'caballoB', '♞': 'caballoN',
    '♗': 'alfilB', '♝': 'alfilN',
    '♕': 'reinaB', '♛': 'reinaN',
    '♔': 'reyB', '♚': 'reyN'
};

const reglasMovimiento = {
    'peonB': (origen, destino) => moverPeon(origen, destino, -1),
    'peonN': (origen, destino) => moverPeon(origen, destino, 1),
    'torreB': (origen, destino) => moverRecto(origen, destino),
    'torreN': (origen, destino) => moverRecto(origen, destino),
    'caballoB': (origen, destino) => moverCaballo(origen, destino),
    'caballoN': (origen, destino) => moverCaballo(origen, destino),
    'alfilB': (origen, destino) => moverDiagonal(origen, destino),
    'alfilN': (origen, destino) => moverDiagonal(origen, destino),
    'reinaB': (origen, destino) => moverRecto(origen, destino) || moverDiagonal(origen, destino),
    'reinaN': (origen, destino) => moverRecto(origen, destino) || moverDiagonal(origen, destino),
    'reyB': (origen, destino) => moverRey(origen, destino),
    'reyN': (origen, destino) => moverRey(origen, destino)
};

function crearTablero() {
    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const casilla = document.createElement('div');
            casilla.classList.add('casilla', (fila + col) % 2 === 0 ? 'blanca' : 'negra');
            casilla.dataset.fila = fila;
            casilla.dataset.col = col;

            const pieza = posicionInicial[fila][col];
            if (pieza) casilla.textContent = piezas[pieza];

            casilla.addEventListener('click', () => seleccionarCasilla(casilla));
            tablero.appendChild(casilla);
        }
    }
}

function seleccionarCasilla(casilla) {
    if (seleccionada) {
        moverPieza(seleccionada, casilla);
        seleccionada.classList.remove('seleccionada');
        deseleccionarMovimientosPosibles();
        seleccionada = null;
    } else if (casilla.textContent && esTurnoCorrecto(casilla)) {
        seleccionada = casilla;
        casilla.classList.add('seleccionada');
    }
}

function esTurnoCorrecto(casilla) {
    const pieza = mapeoPiezas[casilla.textContent];
    return (turno === 'B' && pieza.includes('B')) || (turno === 'N' && pieza.includes('N'));
}


function moverPieza(origen, destino) {
    const piezaOrigen = origen.textContent;
    const piezaDestino = destino.textContent;

    if (!piezaOrigen) return; // Si no hay pieza en el origen, salir.

    const pieza = mapeoPiezas[piezaOrigen];

    if (!pieza || !reglasMovimiento[pieza]) {
        console.error(`Movimiento inválido: No hay reglas para la pieza '${piezaOrigen}' (${pieza})`);
        return;
    }

    // Verificar si el movimiento es válido según las reglas y si no hay una pieza del mismo color en la casilla destino
    if (reglasMovimiento[pieza](origen, destino) && (!piezaDestino || esPiezaOponente(origen, destino))) {
        destino.textContent = piezaOrigen;
        origen.textContent = '';

        // Verificar si se capturó la reina
        if (piezaDestino === '♕' || piezaDestino === '♛') {
            mostrarMensajeGanador(turno === 'B' ? 'Blancas' : 'Negras');
            return;
        }

        // Cambiar de turno después de un movimiento válido
        cambiarTurno();
    }
}

function reiniciarJuego() {
    partidaTerminada = false;
    turno = 'B';
    actualizarIndicadorTurno();
    
    // Ocultar el mensaje de ganador si estaba visible
    const mensajeDiv = document.getElementById("mensaje");
    mensajeDiv.style.display = "none";
    mensajeDiv.textContent = "";

    // Limpiar el tablero antes de volver a crearlo
    tablero.innerHTML = "";
    
    // Volver a generar el tablero con las piezas en su posición inicial
    crearTablero();
}

function esPiezaOponente(origen, destino) {
    const piezaOrigen = mapeoPiezas[origen.textContent];
    const piezaDestino = mapeoPiezas[destino.textContent];

    return (piezaOrigen.includes('B') && piezaDestino.includes('N')) ||
        (piezaOrigen.includes('N') && piezaDestino.includes('B'));
}

function mostrarMensajeGanador(jugador) {
    const mensajeDiv = document.getElementById("mensaje");
    mensajeDiv.textContent = `¡${jugador} han ganado la partida!`;
    mensajeDiv.style.display = "block";
    partidaTerminada = true;
}

function moverPeon(origen, destino, direccion) {
    const filaOrigen = parseInt(origen.dataset.fila);
    const colOrigen = parseInt(origen.dataset.col);
    const filaDestino = parseInt(destino.dataset.fila);
    const colDestino = parseInt(destino.dataset.col);

    if (colDestino === colOrigen && !destino.textContent) {
        if (filaDestino === filaOrigen + direccion) return true;
        if ((direccion === -1 && filaOrigen === 6 && filaDestino === 4) ||
            (direccion === 1 && filaOrigen === 1 && filaDestino === 3)) return true;
    }

    if (Math.abs(colDestino - colOrigen) === 1 && filaDestino === filaOrigen + direccion) {
        return destino.textContent && esPiezaOponente(origen, destino);
    }

    return false;
}

function moverRecto(origen, destino) {
    return true;
}

function moverDiagonal(origen, destino) {
    return true;
}

function moverCaballo(origen, destino) {
    return (Math.abs(origen.dataset.fila - destino.dataset.fila) === 2 && Math.abs(origen.dataset.col - destino.dataset.col) === 1) ||
        (Math.abs(origen.dataset.fila - destino.dataset.fila) === 1 && Math.abs(origen.dataset.col - destino.dataset.col) === 2);
}

function moverRey(origen, destino) {
    return Math.abs(origen.dataset.fila - destino.dataset.fila) <= 1 && Math.abs(origen.dataset.col - destino.dataset.col) <= 1;
}

function deseleccionarMovimientosPosibles() {
    document.querySelectorAll('.movimientoPosible').forEach(casilla => casilla.classList.remove('movimientoPosible'));
}

crearTablero();
