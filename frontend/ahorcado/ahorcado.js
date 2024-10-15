let palabra = "";
let intentos = 0;
const maxIntentos = 6;
let letrasAdivinadas = [];
let letrasSeleccionadas = [];

const imagenesAhorcado = [
    'images/ahorcado_1.png',
    'images/ahorcado_2.png',
    'images/ahorcado_3.png',
    'images/ahorcado_4.png',
    'images/ahorcado_5.png',
    'images/ahorcado_6.png',
    'images/ahorcado_7.png'
];

const wordDisplay = document.getElementById('word-display');
const selectedLetters = document.getElementById('selected-letters');
const ahorcadoImage = document.getElementById('ahorcado-image');
const lettersContainer = document.getElementById('letters-container');
const restartButton = document.getElementById('restart-button');

function inicializarJuego() {
    intentos = 0;
    letrasSeleccionadas = [];
    actualizarLetrasSeleccionadas();
    ahorcadoImage.src = imagenesAhorcado[0]; 
    generarBotonesLetras(); 
    restartButton.style.display = "none"; 

    fetch('/api/games/palabra-aleatoria')
        .then(response => response.json())
        .then(data => {
            palabra = data.palabra;
            letrasAdivinadas = Array(palabra.length).fill("_"); 
            actualizarPalabraMostrada(); 
        })
        .catch(err => console.error('Error al obtener la palabra:', err));
}

function generarBotonesLetras() {
    lettersContainer.innerHTML = ""; 
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letras.forEach(letra => {
        const button = document.createElement("button");
        button.textContent = letra;
        button.addEventListener("click", () => manejarSeleccionLetra(letra.toLowerCase()));
        lettersContainer.appendChild(button);
    });
}

function manejarSeleccionLetra(letra) {
    if (letrasSeleccionadas.includes(letra)) {
        return; 
    }

    letrasSeleccionadas.push(letra); 
    actualizarLetrasSeleccionadas();

    if (palabra.includes(letra)) {
        for (let i = 0; i < palabra.length; i++) {
            if (palabra[i] === letra) {
                letrasAdivinadas[i] = letra; 
            }
        }
        actualizarPalabraMostrada();

        if (!letrasAdivinadas.includes("_")) {
            finalizarJuego("¡Ganaste!");
        }
    } else {
        intentos++;
        ahorcadoImage.src = imagenesAhorcado[intentos]; 

        if (intentos === maxIntentos) {
            finalizarJuego("¡Perdiste!", true); 
        }
    }
}

function actualizarPalabraMostrada() {
    wordDisplay.textContent = letrasAdivinadas.join(" ");
}

function actualizarLetrasSeleccionadas() {
    selectedLetters.textContent = `Letras seleccionadas: ${letrasSeleccionadas.join(", ")}`;
}

function finalizarJuego(mensaje, mostrarPalabra = false) {
    if (mostrarPalabra) {
        mensaje += ` La palabra era: ${palabra}.`;
    }
    alert(mensaje);
    restartButton.style.display = "block"; 
}
restartButton.addEventListener("click", inicializarJuego);

inicializarJuego();