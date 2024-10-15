const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSetup = require('./swagger');
const app = express();
const gameRoutes = require('./routes/rutas-juegos');

app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.use('/api/games', gameRoutes);

swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});