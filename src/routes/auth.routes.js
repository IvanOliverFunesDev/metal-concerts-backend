import { Router } from 'express';

const router = Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente!');
});

export default router;
