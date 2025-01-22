import { Router } from 'express';
import { validateSchema } from '../middleware/validator-schema.middleware.js';
import { loginSchema } from '../schemas/auth/login-auth-schema.js';
import { registerUserSchema } from '../schemas/auth/user-auth-schema.js';
import { registerBandSchema } from '../schemas/auth/band-auth-schema.js';
import { loginController, logoutController } from '../controllers/auth/auth.controller.js';
import { registerControllerUser } from '../controllers/auth/user-auth.controller.js';
import { registerControllerBand } from '../controllers/auth/band-auth.controller.js';
import { profileUserController } from '../controllers/users/user.controller.js';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { profileBandController } from '../controllers/bands/band.controller.js';
import { checkRole } from '../middleware/check-role.middleware.js';
import { createConcertController, deleteConcertController, getAllConcertsController, updateConcertController } from '../controllers/concerts/concert.controller.js';
import { checkOwnerShip } from '../middleware/check-owner-ship.middleware.js';

const router = Router();

router.get('/', (req, res) => {
  res.send('✅ Backend funcionando correctamente!');
});
router.post('/login', validateSchema(loginSchema), loginController);
router.post('/register/user', validateSchema(registerUserSchema), registerControllerUser);
router.post('/register/band', validateSchema(registerBandSchema), registerControllerBand);
router.post('/logout', logoutController);
router.get('/profile/user', authRequired, checkRole('user'), profileUserController);
router.get('/profile/band', authRequired, checkRole('band'), profileBandController);

router.get('/concerts', getAllConcertsController);
router.post('/concerts', authRequired, checkRole('band'), createConcertController);
router.put('/concerts/id', authRequired, checkRole('band'), checkOwnerShip, updateConcertController);
router.delete('/concerts/id', authRequired, checkRole('band'), checkOwnerShip, deleteConcertController);

export default router;
