import { Router } from 'express';
import { validateSchema } from '../middleware/validator.middleware.js';
import { loginSchema } from '../schemas/auth/login-auth-schema.js';
import { registerUserSchema } from '../schemas/auth/user-auth-schema.js';
import { registerBandSchema } from '../schemas/auth/band-auth-schema.js';
import { loginController, logoutController } from '../controllers/auth/auth.controller.js';
import { registerControllerUser } from '../controllers/auth/user-auth.controller.js';
import { registerControllerBand } from '../controllers/auth/band-auth.controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente!');
});
router.post('/login', validateSchema(loginSchema), loginController);
router.post('/register/user', validateSchema(registerUserSchema), registerControllerUser);
router.post('/register/band', validateSchema(registerBandSchema), registerControllerBand);
router.post('/logout', logoutController);

export default router;
