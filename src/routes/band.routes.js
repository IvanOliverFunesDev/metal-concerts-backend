import { Router } from 'express';
import { checkBandStatus } from '../middleware/check-role.middleware.js';
import { authOptional, authRequired } from '../middleware/validate-token.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { getAllBandsController, getBandPublicProfileController, getPopularBandsController, getOwnBandController, getTopRatedBandsController, updateBandProfileController, updateDescriptionController, updateBandImageController, updateGenreController, updateBandNameController } from '../controllers/bands/band.controller.js';

const router = Router();

router.get('/', authOptional, getAllBandsController);
router.get('/popular', authOptional, getPopularBandsController);
router.get('/top-rated', authOptional, getTopRatedBandsController);
router.get('/me', authRequired, getOwnBandController);
router.get('/:id', authOptional, getBandPublicProfileController);
router.put('/update-profile', authRequired, checkBandStatus('approved'), upload.single('file'), updateBandProfileController);
router.patch('/me/band-name', authRequired, updateBandNameController);
router.patch('/me/genre', authRequired, updateGenreController);
router.patch('/me/description', authRequired, updateDescriptionController);
router.patch('/me/image', authRequired, upload.single('image'), updateBandImageController);
export default router;
