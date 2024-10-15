const fs = require('fs');
const path = require('path');

let ultimaPalabra = '';

  exports.piedraPapelTijera = (req, res) => {
    const { userChoice } = req.body;

    // Opciones disponibles: Piedra, Papel, Tijera
    const choices = ['piedra', 'papel', 'tijera'];

    // Generar la elección del oponente de forma aleatoria
    const opponentChoice = choices[Math.floor(Math.random() * choices.length)];

    // Determinar el resultado (Ganaste, Perdiste, Empate)
    let result;

    if (userChoice === opponentChoice) {
        result = 'Empate';
    } else if (
        (userChoice === 'piedra' && opponentChoice === 'tijera') ||
        (userChoice === 'papel' && opponentChoice === 'piedra') ||
        (userChoice === 'tijera' && opponentChoice === 'papel')
    ) {
        result = 'Ganaste';
    } else {
        result = 'Perdiste';
    }

    // Devolver la elección del usuario, la del oponente y el resultado
    res.json({
        userChoice,
        opponentChoice,
        result
    });
};

exports.obtenerPalabraAleatoria = (req, res) => {
  const filePath = path.join(__dirname, '../data/palabras.json');

  // Leer el archivo palabras.json
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error al leer el archivo de palabras:', err);
          return res.status(500).json({ error: 'Error al obtener la palabra.' });
      }

      // Parsear el archivo JSON
      const palabras = JSON.parse(data).palabras;

      let palabraAleatoria = '';

      // Seleccionar una palabra al azar que no sea la última seleccionada
      do {
          palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
      } while (palabraAleatoria === ultimaPalabra);

      // Guardar la nueva palabra como la última seleccionada
      ultimaPalabra = palabraAleatoria;

      // Devolver la palabra al frontend
      res.json({ palabra: palabraAleatoria });
  });
};