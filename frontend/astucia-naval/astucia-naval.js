let tableroJugador = Array.from({ length: 10 }, () => Array(10).fill(' '));
let tableroIA = Array.from({ length: 10 }, () => Array(10).fill(' ')); // Tablero del oponente

// Definición de los barcos y sus colores
const barcos = [
    { nombre: 'Portaaviones', tamaño: 5, clase: 'barco-portaaviones', colocado: false },
    { nombre: 'Submarino', tamaño: 3, clase: 'barco-submarino', colocado: false },
    { nombre: 'Destructor', tamaño: 2, clase: 'barco-destructor', colocado: false }
];

let barcoSeleccionado = null;  // Barco que el usuario selecciona
let orientacion = 'horizontal';  // Orientación inicial para colocar los barcos
let ataquesRealizados = [];  // Para evitar ataques repetidos por la IA

// Referencias a los elementos del DOM
const tableroJugadorDiv = document.getElementById('tablero-jugador');
const barcosListaDiv = document.getElementById('barcos-lista');
const orientacionActualSpan = document.getElementById('orientacion-actual');
const botonOrientacion = document.getElementById('boton-orientacion');
const botonContinuar = document.getElementById('boton-continuar');
const faseJuegoDiv = document.getElementById('fase-juego'); // Contiene los dos tableros de juego
const tableroJugadorFaseJuegoDiv = document.getElementById('tablero-jugador-fase-juego');
const tableroOponenteDiv = document.getElementById('tablero-oponente');

orientacionActualSpan.textContent = orientacion;

let currentFila = null;
let currentColumna = null;

// Función para generar la lista de barcos que el jugador debe colocar
function generarListaBarcos() {
    barcos.forEach(barco => {
        const barcoDiv = document.createElement('div');
        barcoDiv.classList.add('barco', 'barco-colocar');
        barcoDiv.textContent = `${barco.nombre} (${barco.tamaño})`;

        // Comprobar si el barco ya está colocado
        barcoDiv.addEventListener('click', () => {
            if (!barco.colocado) {
                seleccionarBarco(barco, barcoDiv);
            } else {
                alert(`Ya has colocado el ${barco.nombre}.`);
            }
        });

        barcosListaDiv.appendChild(barcoDiv);
    });
}

// Función para seleccionar un barco de la lista
function seleccionarBarco(barco, barcoDiv) {
    barcoSeleccionado = barco;

    // Desmarcar todos los barcos seleccionados previamente
    document.querySelectorAll('.barco').forEach(div => div.classList.remove('placer'));

    // Marcar el barco seleccionado
    barcoDiv.classList.add('placer');
}

// Función para mostrar vista previa del barco en el tablero al pasar el mouse
function mostrarVistaPrevia(fila, columna) {
    if (!barcoSeleccionado) return;

    const { tamaño } = barcoSeleccionado;
    let esValido = true;

    // Validar si el barco cabe en la posición actual
    for (let i = 0; i < tamaño; i++) {
        let currentFila = orientacion === 'horizontal' ? fila : fila + i;
        let currentColumna = orientacion === 'horizontal' ? columna + i : columna;

        // Verificar límites del tablero
        if (currentFila < 0 || currentFila >= 10 || currentColumna < 0 || currentColumna >= 10) {
            esValido = false;
            break;
        }

        // Verificar si la celda ya está ocupada
        if (tableroJugador[currentFila][currentColumna] !== ' ') {
            esValido = false;
            break;
        }
    }

    // Mostrar la vista previa del barco
    for (let i = 0; i < tamaño; i++) {
        let currentFila = orientacion === 'horizontal' ? fila : fila + i;
        let currentColumna = orientacion === 'horizontal' ? columna + i : columna;

        // Verificar límites del tablero antes de acceder a la celda
        if (currentFila < 0 || currentFila >= 10 || currentColumna < 0 || currentColumna >= 10) {
            continue;
        }

        const celda = tableroJugadorDiv.querySelector(`div[data-fila="${currentFila}"][data-columna="${currentColumna}"]`);
        if (celda) {
            if (esValido) {
                celda.classList.add('preview');
            } else {
                celda.classList.add('preview-invalid');
            }
        }
    }
}

// Función para quitar la vista previa del barco al mover el mouse fuera
function quitarVistaPrevia(fila, columna) {
    if (!barcoSeleccionado) return;

    const { tamaño } = barcoSeleccionado;

    for (let i = 0; i < tamaño; i++) {
        let currentFila = orientacion === 'horizontal' ? fila : fila + i;
        let currentColumna = orientacion === 'horizontal' ? columna + i : columna;

        // Verificar límites del tablero antes de acceder a la celda
        if (currentFila < 0 || currentFila >= 10 || currentColumna < 0 || currentColumna >= 10) {
            continue;
        }

        const celda = tableroJugadorDiv.querySelector(`div[data-fila="${currentFila}"][data-columna="${currentColumna}"]`);
        if (celda) {
            celda.classList.remove('preview');
            celda.classList.remove('preview-invalid');
        }
    }
}

// Función para colocar un barco en el tablero del jugador
function colocarBarcoJugador(fila, columna) {
    if (!barcoSeleccionado) {
        alert('Selecciona un barco antes de colocarlo.');
        return;
    }

    const { tamaño, clase } = barcoSeleccionado;

    // Colocar el barco en el tablero si es válido
    const exito = colocarBarco(tableroJugador, fila, columna, tamaño, orientacion);

    if (exito) {
        // Actualizar visualmente el tablero
        for (let i = 0; i < tamaño; i++) {
            const currentFila = orientacion === 'horizontal' ? fila : fila + i;
            const currentColumna = orientacion === 'horizontal' ? columna + i : columna;

            const celda = tableroJugadorDiv.querySelector(`div[data-fila="${currentFila}"][data-columna="${currentColumna}"]`);
            if (celda) celda.classList.add(clase);
        }

        // Marcar el barco como colocado
        barcoSeleccionado.colocado = true;

        // Desactivar el barco seleccionado después de colocarlo
        barcoSeleccionado = null;
        document.querySelectorAll('.barco').forEach(div => div.classList.remove('placer'));

        // Verificar si todos los barcos están colocados
        verificarColocacionCompleta();
    } else {
        alert('No se puede colocar el barco en esta posición.');
    }
}

// Función para verificar si todos los barcos han sido colocados
function verificarColocacionCompleta() {
    const todosColocados = barcos.every(barco => barco.colocado);
    if (todosColocados) {
        // Habilitar el botón de continuar
        botonContinuar.disabled = false;
        alert('¡Todos los barcos han sido colocados! Puedes continuar.');
    }
}

// Función para validar y colocar el barco en el array del tablero
function colocarBarco(tablero, fila, columna, tamaño, orientacion) {
    if (orientacion === 'horizontal') {
        if (columna + tamaño > 10) return false;  // No cabe horizontalmente
        for (let i = 0; i < tamaño; i++) {
            if (tablero[fila][columna + i] !== ' ') return false;  // Ya ocupado
        }
        for (let i = 0; i < tamaño; i++) {
            tablero[fila][columna + i] = 'B';  // Colocar barco
        }
    } else {
        if (fila + tamaño > 10) return false;  // No cabe verticalmente
        for (let i = 0; i < tamaño; i++) {
            if (tablero[fila + i][columna] !== ' ') return false;  // Ya ocupado
        }
        for (let i = 0; i < tamaño; i++) {
            tablero[fila + i][columna] = 'B';  // Colocar barco
        }
    }
    return true;
}

// Función para generar el tablero del oponente (IA) con barcos colocados aleatoriamente
function generarTableroIA() {
    barcos.forEach(barco => {
        let colocado = false;
        while (!colocado) {
            const fila = Math.floor(Math.random() * 10);
            const columna = Math.floor(Math.random() * 10);
            const orientacionIA = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            colocado = colocarBarco(tableroIA, fila, columna, barco.tamaño, orientacionIA);
        }
    });
}

// Función para generar el tablero visualmente
function generarTableroVisual(tableroDiv, tablero, esIA) {
    tableroDiv.innerHTML = '';
    for (let fila = 0; fila < 10; fila++) {
        for (let columna = 0; columna < 10; columna++) {
            const celda = document.createElement('div');
            celda.dataset.fila = fila;
            celda.dataset.columna = columna;

            if (!esIA) {
                // Mostrar vista previa del barco antes de colocarlo
                celda.addEventListener('mouseover', () => {
                    currentFila = parseInt(celda.dataset.fila);
                    currentColumna = parseInt(celda.dataset.columna);
                    mostrarVistaPrevia(currentFila, currentColumna);
                });
                celda.addEventListener('mouseout', () => {
                    quitarVistaPrevia(currentFila, currentColumna);
                    currentFila = null;
                    currentColumna = null;
                });

                // Permitir al jugador colocar barcos
                celda.addEventListener('click', () => colocarBarcoJugador(parseInt(celda.dataset.fila), parseInt(celda.dataset.columna)));
            } else {
                // Si es el tablero del oponente, habilitar ataques
                celda.addEventListener('click', () => realizarAtaque(parseInt(celda.dataset.fila), parseInt(celda.dataset.columna)));
            }

            tableroDiv.appendChild(celda);
        }
    }
}

// Función para realizar un ataque del jugador en el tablero del oponente
function realizarAtaque(fila, columna) {
    const celda = tableroOponenteDiv.querySelector(`div[data-fila="${fila}"][data-columna="${columna}"]`);

    // Verificar si la celda ya ha sido atacada
    if (celda.style.backgroundColor === '') {  // Solo permitir ataques en celdas no atacadas
        if (tableroIA[fila][columna] === 'B') {
            celda.style.backgroundColor = 'red';  // Cambia el color a rojo si acierta
        } else {
            celda.style.backgroundColor = 'grey';  // Cambia el color a gris si falla
        }
        // La IA responde después del ataque del jugador
        ataqueIA();
    } else {
        alert('Ya has atacado esta posición. Selecciona otra.');
    }
}

// Función para que la IA ataque el tablero del jugador
function ataqueIA() {
    let fila, columna;
    do {
        fila = Math.floor(Math.random() * 10);
        columna = Math.floor(Math.random() * 10);
    } while (ataquesRealizados.some(a => a.fila === fila && a.columna === columna));

    ataquesRealizados.push({ fila, columna });

    const celda = tableroJugadorFaseJuegoDiv.querySelector(`div[data-fila="${fila}"][data-columna="${columna}"]`);

    if (tableroJugador[fila][columna] === 'B') {
        celda.style.backgroundColor = 'red';  // Cambia el color a rojo si acierta
    } else {
        celda.style.backgroundColor = 'grey';  // Cambia el color a gris si falla
    }
}

// Cambiar orientación con el botón
botonOrientacion.addEventListener('click', () => {
    orientacion = orientacion === 'horizontal' ? 'vertical' : 'horizontal';
    orientacionActualSpan.textContent = orientacion;

    // Actualizar la vista previa si el mouse está sobre una celda
    if (currentFila !== null && currentColumna !== null) {
        quitarVistaPrevia(currentFila, currentColumna);
        mostrarVistaPrevia(currentFila, currentColumna);
    }
});

// Función para manejar el clic en el botón "Continuar"
botonContinuar.addEventListener('click', () => {
    // Ocultar la fase de colocación y mostrar la fase de juego
    document.getElementById('fase-colocacion').style.display = 'none';
    document.getElementById('barcos-lista').style.display = 'none';
    document.getElementById('instrucciones-colocacion').style.display = 'none';
    document.getElementById('lista-instrucciones').style.display = 'none';
    document.getElementById('boton-orientacion').style.display = 'none';
    tableroJugadorDiv.style.display = 'none';
    botonContinuar.style.display = 'none';
    document.getElementById('reiniciar').style.display = 'none';
    
    // Ocultar el texto de orientación actual
    orientacionActualSpan.style.display = 'none';

    // Mostrar la fase de juego
    faseJuegoDiv.style.display = 'block';

    // Generar el tablero del oponente
    generarTableroVisual(tableroOponenteDiv, tableroIA, true);

    // Copiar el tablero del jugador a la nueva vista
    generarTableroVisual(tableroJugadorFaseJuegoDiv, tableroJugador, false);

    // Colocar los barcos de la IA
    generarTableroIA();
});

// Inicializar el juego
function inicializarJuego() {
    generarTableroVisual(tableroJugadorDiv, tableroJugador, false); // Generar tablero del jugador
    generarListaBarcos(); // Generar lista de barcos para colocar
}

inicializarJuego();