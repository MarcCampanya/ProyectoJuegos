// Función para obtener una palabra aleatoria de la API
async function obtenerPalabraEspañol() {
    const apiKey = 'hfla0venfgpn32owgkalfe37il78jjdjedlzwvn7ke48hd6mn';  // Sustituye con tu clave
    try {
        const response = await fetch(`https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&minLength=5&maxLength=5&api_key=${apiKey}`);
        const data = await response.json();
        
        // Filtros para asegurar que sea una palabra en español, si la API soporta múltiples idiomas
        const palabra = data.word;
        console.log('Palabra aleatoria en español:', palabra);
        return palabra;
    } catch (error) {
        console.error('Error al obtener la palabra:', error);
        return null;
    }
}

// Variables globales
let palabraSecreta;
let intentos = 0;

// Función para inicializar el juego
async function inicializarJuego() {
    palabraSecreta = await obtenerPalabraEspañol(); // Cambié la función a obtenerPalabraEspañol
    console.log('Palabra secreta:', palabraSecreta);
    intentos = 0;

    // Limpiar la cuadrícula y el mensaje
    document.getElementById('wordle-grid').innerHTML = '';  // Limpiar la cuadrícula
    document.getElementById('message').textContent = '';
    document.getElementById('guess-input').value = '';

    // Crear la cuadrícula 5x5
    crearCuadricula();
}

// Función para crear la cuadrícula 5x5
function crearCuadricula() {
    const grid = document.getElementById('wordle-grid');
    grid.innerHTML = ''; // Limpiar cualquier contenido previo

    // Crear 6 filas de 5 celdas (para los intentos)
    for (let i = 0; i < 6; i++) {
        const fila = document.createElement('div');
        fila.classList.add('grid-row');
        
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            fila.appendChild(cell);
        }

        grid.appendChild(fila);
    }
}

// Función para manejar la adivinanza
function verificarAdivinanza() {
    const adivinanza = document.getElementById('guess-input').value.toLowerCase();
    const mensaje = document.getElementById('message');
    const grid = document.getElementById('wordle-grid');

    if (adivinanza.length !== 5) {
        mensaje.textContent = 'La palabra debe tener 5 letras.';
        return;
    }

    if (intentos >= 6) {
        mensaje.textContent = `¡Se acabaron los intentos! La palabra era: ${palabraSecreta}`;
        return;
    }

    // Seleccionar la fila correspondiente al intento actual
    const fila = grid.children[intentos]; // Selecciona la fila del intento actual

    // Comparar la adivinanza con la palabra secreta
    for (let i = 0; i < 5; i++) {
        const letra = adivinanza[i];
        const cell = fila.children[i]; // Selecciona la celda correspondiente

        // Comparar letra con la palabra secreta
        if (letra === palabraSecreta[i]) {
            cell.classList.add('correct');
        } else if (palabraSecreta.includes(letra)) {
            cell.classList.add('present');
        } else {
            cell.classList.add('absent');
        }

        cell.textContent = letra; // Mostrar la letra en la celda
    }

    intentos++;

    // Verificar si la palabra fue adivinada
    if (adivinanza === palabraSecreta) {
        mensaje.textContent = '¡Felicidades! Has adivinado la palabra.';
    } else if (intentos >= 6) {
        mensaje.textContent = `¡Se acabaron los intentos! La palabra era: ${palabraSecreta}`;
    } else {
        mensaje.textContent = 'Intenta de nuevo.';
    }
}

// Evento para el botón de adivinar
document.getElementById('submit-guess').addEventListener('click', verificarAdivinanza);

// Evento para el botón de reiniciar
document.getElementById('restart-game').addEventListener('click', inicializarJuego);

// Inicializar el juego al cargar la página
inicializarJuego();

// Evento para el ícono de inicio
document.querySelector("header h1").addEventListener("click", () => {
    window.location.href = "/index.html";
});
