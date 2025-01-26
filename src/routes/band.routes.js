import { Router } from 'express';

import { checkRole } from '../middleware/check-role.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';

import { getAllBandsController, getBandPublicProfileController, updateBandProfileController } from '../controllers/bands/band.controller.js';

const router = Router();

router.get('/', getAllBandsController);
router.get('/:id', getBandPublicProfileController);
router.put('/:id', authRequired, checkRole('band'), updateBandProfileController);

export default router;
