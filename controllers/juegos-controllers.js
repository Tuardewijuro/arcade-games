const fs = require('fs');
const path = require('path');

let ultimaPalabra = '';

  exports.piedraPapelTijera = (req, res) => {
    const { userChoice } = req.body;

    const choices = ['piedra', 'papel', 'tijera'];

    const opponentChoice = choices[Math.floor(Math.random() * choices.length)];

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

    res.json({
        userChoice,
        opponentChoice,
        result
    });
};

exports.obtenerPalabraAleatoria = (req, res) => {
  const filePath = path.join(__dirname, '../data/palabras.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error al leer el archivo de palabras:', err);
          return res.status(500).json({ error: 'Error al obtener la palabra.' });
      }

      const palabras = JSON.parse(data).palabras;

      let palabraAleatoria = '';

      do {
          palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
      } while (palabraAleatoria === ultimaPalabra);

      ultimaPalabra = palabraAleatoria;

      res.json({ palabra: palabraAleatoria });
  });
};