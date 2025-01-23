import { Router } from 'express';
import { checkRole } from '../middleware/check-role.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { getAllBands, getBandPublicProfile, updateBandProfile } from '../controllers/bands/band.controller.js';

const router = Router();

router.get('/', getAllBands);
router.get('/:id', getBandPublicProfile);
router.put('/:id', authRequired, checkRole('band'), updateBandProfile);

export default router;
