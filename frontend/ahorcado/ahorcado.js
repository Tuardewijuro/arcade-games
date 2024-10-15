let palabra = "";
let intentos = 0;
const maxIntentos = 6;
let letrasAdivinadas = [];
let letrasSeleccionadas = [];

// Mapa de imágenes del ahorcado
const imagenesAhorcado = [
    'images/ahorcado_1.png',
    'images/ahorcado_2.png',
    'images/ahorcado_3.png',
    'images/ahorcado_4.png',
    'images/ahorcado_5.png',
    'images/ahorcado_6.png',
    'images/ahorcado_7.png'
];

// Referencias a elementos del DOM
const wordDisplay = document.getElementById('word-display');
const selectedLetters = document.getElementById('selected-letters');
const ahorcadoImage = document.getElementById('ahorcado-image');
const lettersContainer = document.getElementById('letters-container');
const restartButton = document.getElementById('restart-button');

// Función para inicializar el juego
function inicializarJuego() {
    intentos = 0;
    letrasSeleccionadas = [];
    actualizarLetrasSeleccionadas();
    ahorcadoImage.src = imagenesAhorcado[0]; // Imagen inicial del ahorcado
    generarBotonesLetras(); // Generar los botones de letras
    restartButton.style.display = "none"; // Ocultar el botón de reinicio

    // Obtener palabra aleatoria desde el backend
    fetch('/api/games/palabra-aleatoria')
        .then(response => response.json())
        .then(data => {
            palabra = data.palabra;
            letrasAdivinadas = Array(palabra.length).fill("_"); // Inicializamos la palabra con guiones
            actualizarPalabraMostrada(); // Mostramos los guiones bajos
        })
        .catch(err => console.error('Error al obtener la palabra:', err));
}

// Generar botones de letras A-Z
function generarBotonesLetras() {
    lettersContainer.innerHTML = ""; // Limpiar letras previas
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letras.forEach(letra => {
        const button = document.createElement("button");
        button.textContent = letra;
        button.addEventListener("click", () => manejarSeleccionLetra(letra.toLowerCase()));
        lettersContainer.appendChild(button);
    });
}

// Manejar la selección de una letra
function manejarSeleccionLetra(letra) {
    if (letrasSeleccionadas.includes(letra)) {
        return; // Si la letra ya fue seleccionada, no hacer nada
    }

    letrasSeleccionadas.push(letra); // Añadir la letra seleccionada
    actualizarLetrasSeleccionadas();

    if (palabra.includes(letra)) {
        for (let i = 0; i < palabra.length; i++) {
            if (palabra[i] === letra) {
                letrasAdivinadas[i] = letra; // Actualizar las letras adivinadas
            }
        }
        actualizarPalabraMostrada();

        // Verificar si el jugador ha ganado
        if (!letrasAdivinadas.includes("_")) {
            finalizarJuego("¡Ganaste!");
        }
    } else {
        intentos++;
        ahorcadoImage.src = imagenesAhorcado[intentos]; // Actualizar la imagen del ahorcado

        if (intentos === maxIntentos) {
            finalizarJuego("¡Perdiste!", true); // Mostrar la palabra al perder
        }
    }
}

// Actualizar la palabra mostrada
function actualizarPalabraMostrada() {
    wordDisplay.textContent = letrasAdivinadas.join(" ");
}

// Actualizar las letras seleccionadas
function actualizarLetrasSeleccionadas() {
    selectedLetters.textContent = `Letras seleccionadas: ${letrasSeleccionadas.join(", ")}`;
}

// Finalizar el juego
function finalizarJuego(mensaje, mostrarPalabra = false) {
    if (mostrarPalabra) {
        mensaje += ` La palabra era: ${palabra}.`;
    }
    alert(mensaje);
    restartButton.style.display = "block"; // Mostrar el botón "Jugar de nuevo"
}
// Reiniciar el juego
restartButton.addEventListener("click", inicializarJuego);

// Inicializar el juego al cargar la página
inicializarJuego();