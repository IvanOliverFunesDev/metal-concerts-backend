import { Router } from 'express';
import { validateSchema } from '../middleware/validator.middleware.js';
import { loginSchema } from '../schemas/auth/login-auth-schema.js';
import { registerUserSchema } from '../schemas/auth/user-auth-schema.js';
import { loginController } from '../controllers/auth/auth.controller.js';
import { registerController } from '../controllers/auth/user-auth.controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente!');
});
router.post('/login', validateSchema(loginSchema), loginController);
router.post('/register/user', validateSchema(registerUserSchema), registerController);

export default router;
