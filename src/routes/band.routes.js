import { Router } from 'express';
import { checkBandStatus } from '../middleware/check-role.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { getAllBandsController, getBandPublicProfileController, getPopularBandsController, getTopRatedBandsController, updateBandProfileController } from '../controllers/bands/band.controller.js';

const router = Router();

router.get('/', getAllBandsController);
router.get('/popular', getPopularBandsController);
router.get('/top-rated', getTopRatedBandsController);
router.get('/:id', getBandPublicProfileController);
router.put('/update-profile', authRequired, checkBandStatus('approved'), upload.single('file'), updateBandProfileController);

export default router;
