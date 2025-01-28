import express from 'express';
import connectDB from './db.js';
import config from './config.js';
import loaders from './loaders/index.js';

const app = express();
connectDB();
loaders.init(app);

if (process.argv[1] === new URL(import.meta.url).pathname) {
  const PORT = config.app.PORT;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}...`);
  });
}

export default app;
