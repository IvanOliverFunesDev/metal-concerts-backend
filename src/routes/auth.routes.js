import { Router } from 'express';
// import { validateSchema } from '../middleware/validator.middleware.js';
// import { loginSchema } from '../schemas/auth/login-auth-schema.js';
const router = Router();

// Ruta de prueba
router.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente!');
});
// router.post('/login', validateSchema(loginSchema), logincontroller);

export default router;
