const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSetup = require('./swagger');
const app = express();

app.use(express.json());

const gameRoutes = require('./routes/games.routes');
app.use('/api/games', gameRoutes);

swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});