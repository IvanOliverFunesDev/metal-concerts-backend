import express from 'express';
import connectDB from './db.js'; // Comentar para la rama sin docker
import config from './config.js';
import loaders from './loaders/index.js';

const app = express();
connectDB(); // Comentar para la rama sin docker
loaders.init(app);

if (process.argv[1] === new URL(import.meta.url).pathname) { // Comentar para la rama sin docker
  const PORT = config.app.PORT;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}...`);
  });
} // Comentar para la rama sin docker

export default app;
