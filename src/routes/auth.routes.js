import { Router } from 'express';
import { loginSchema } from '../schemas/auth/login-auth.schema.js';
import { registerUserSchema } from '../schemas/auth/user-auth.schema.js';
import { registerBandSchema } from '../schemas/auth/band-auth.schema.js';
import { validateSchema } from '../middleware/validator-schema.middleware.js';
import { checkRole } from '../middleware/check-role.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { loginController, logoutController, verifyTokenController } from '../controllers/auth/auth.controller.js';
import { registerUserController } from '../controllers/auth/user-auth.controller.js';
import { registerBandController } from '../controllers/auth/band-auth.controller.js';
import { profileUserController } from '../controllers/users/user.controller.js';
import { profileBandController } from '../controllers/bands/band.controller.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente!');
});
router.post('/login', validateSchema(loginSchema), loginController);
router.post('/register/user', validateSchema(registerUserSchema), registerUserController);
router.post('/register/band', validateSchema(registerBandSchema), registerBandController);
router.post('/logout', logoutController);
router.get('/profile/user', authRequired, checkRole('user'), profileUserController);
router.get('/profile/band', authRequired, checkRole('band'), profileBandController);
router.get('/verify', verifyTokenController);

export default router;
