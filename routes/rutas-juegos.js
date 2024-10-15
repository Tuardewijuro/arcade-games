const express = require('express');
const router = express.Router();
const gameController = require('../controllers/juegos-controllers');

router.post('/piedra-papel-tijera', gameController.piedraPapelTijera);
router.get('/palabra-aleatoria', gameController.obtenerPalabraAleatoria);

module.exports = router;