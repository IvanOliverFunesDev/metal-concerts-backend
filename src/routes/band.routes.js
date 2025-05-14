import { Router } from 'express';
import { checkBandStatus } from '../middleware/check-role.middleware.js';
import { authOptional, authRequired } from '../middleware/validate-token.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { getAllBandsController, getBandPublicProfileController, getPopularBandsController,getOwnBandController, getTopRatedBandsController, updateBandProfileController } from '../controllers/bands/band.controller.js';

const router = Router();

router.get('/', authOptional, getAllBandsController);
router.get('/popular', authOptional, getPopularBandsController);
router.get('/top-rated', authOptional, getTopRatedBandsController);
router.get('/:id', authOptional, getBandPublicProfileController);
router.get('/me', authRequired, getOwnBandController);
router.put('/update-profile', authRequired, checkBandStatus('approved'), upload.single('file'), updateBandProfileController);

export default router;
