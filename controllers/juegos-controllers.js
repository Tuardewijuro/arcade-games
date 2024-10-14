// Controlador para registrar jugador
exports.registerPlayer = (req, res) => {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
  
    // Simulación de registro en el sistema (por ahora no se guarda en base de datos)
    return res.status(200).json({ message: `Jugador ${name} registrado con éxito` });
  };
  
  // Controlador para iniciar el juego
  exports.startGame = (req, res) => {
    const { gameType } = req.body;
    if (!gameType || !['piedra-papel-tijera', 'ahorcado', 'astucia-naval'].includes(gameType)) {
      return res.status(400).json({ error: 'Tipo de juego no válido' });
    }
  
    // Simulación de inicio de juego
    return res.status(200).json({ message: `Iniciando el juego de ${gameType}` });
  };