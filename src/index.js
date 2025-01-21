import express from 'express';
import dotenv from 'dotenv';

dotenv.config(); // 👈 Esto carga las variables de .env

const app = express();
const PORT = process.env.PORT || 3000; // 👈 Asegurar que PORT se carga bien

// Middleware básico
app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Servidor funcionando en el puerto ${PORT} 🚀`);
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}...`);
});
