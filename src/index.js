import express from 'express';
import connectDB from './db.js';
import config from './config.js';

const app = express();

connectDB();

const PORT = config.app.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en el puerto ${PORT}...`);
});
