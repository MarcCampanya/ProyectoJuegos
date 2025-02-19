let turno = 'B'; // B para Blancas, N para Negras
let seleccionada = null;
let partidaTerminada = false;

const piezas = {
    'B': '⚪', // Peón blanco
    'N': '⚫'  // Peón negro
};

const tablero = document.getElementById('tablero');

const posicionInicial = [
    ['', 'N', '', 'N', '', 'N', '', 'N'],
    ['N', '', 'N', '', 'N', '', 'N', ''],
    ['', 'N', '', 'N', '', 'N', '', 'N'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['B', '', 'B', '', 'B', '', 'B', ''],
    ['', 'B', '', 'B', '', 'B', '', 'B'],
    ['B', '', 'B', '', 'B', '', 'B', '']
];

function crearTablero() {
    tablero.innerHTML = '';
    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const casilla = document.createElement('div');
            casilla.classList.add('casilla', (fila + col) % 2 === 0 ? 'blanca' : 'negra');
            casilla.dataset.fila = fila;
            casilla.dataset.col = col;

            if (posicionInicial[fila][col]) {
                casilla.textContent = piezas[posicionInicial[fila][col]];
            }

            casilla.addEventListener('click', () => seleccionarCasilla(casilla));
            tablero.appendChild(casilla);
        }
    }
}

function seleccionarCasilla(casilla) {
    if (partidaTerminada) return;

    if (seleccionada) {
        moverPieza(seleccionada, casilla);
        seleccionada.classList.remove('seleccionada');
        seleccionada = null;
    } else if (casilla.textContent && esTurnoCorrecto(casilla)) {
        seleccionada = casilla;
        casilla.classList.add('seleccionada');
    }
}

function esTurnoCorrecto(casilla) {
    return (turno === 'B' && casilla.textContent === '⚪') ||
           (turno === 'N' && casilla.textContent === '⚫');
}

function moverPieza(origen, destino) {
    const filaOrigen = parseInt(origen.dataset.fila);
    const colOrigen = parseInt(origen.dataset.col);
    const filaDestino = parseInt(destino.dataset.fila);
    const colDestino = parseInt(destino.dataset.col);

    if (!movimientoValido(filaOrigen, colOrigen, filaDestino, colDestino)) return;

    destino.textContent = origen.textContent;
    origen.textContent = '';

    if (filaDestino === 0 && turno === 'B') {
        destino.textContent = '♔'; // Corona dama blanca
    } else if (filaDestino === 7 && turno === 'N') {
        destino.textContent = '♚'; // Corona dama negra
    }

    cambiarTurno();
}

function movimientoValido(filaO, colO, filaD, colD) {
    const direccion = turno === 'B' ? -1 : 1;
    
    if (filaD === filaO + direccion && Math.abs(colD - colO) === 1) {
        return true;
    }

    if (filaD === filaO + 2 * direccion && Math.abs(colD - colO) === 2) {
        const filaSalto = (filaO + filaD) / 2;
        const colSalto = (colO + colD) / 2;
        const casillaIntermedia = document.querySelector(`[data-fila="${filaSalto}"][data-col="${colSalto}"]`);

        if (casillaIntermedia && esPiezaOponente(casillaIntermedia)) {
            casillaIntermedia.textContent = ''; // Eliminar la pieza capturada
            return true;
        }
    }
    
    return false;
}

function esPiezaOponente(casilla) {
    return (turno === 'B' && casilla.textContent === '⚫') ||
           (turno === 'N' && casilla.textContent === '⚪');
}

function cambiarTurno() {
    turno = turno === 'B' ? 'N' : 'B';
    document.getElementById('turno-indicador').textContent = `Turno de: ${turno === 'B' ? 'Blancas' : 'Negras'}`;
}

function reiniciarJuego() {
    turno = 'B';
    partidaTerminada = false;
    document.getElementById('mensaje').style.display = "none";
    crearTablero();
}

crearTablero();
