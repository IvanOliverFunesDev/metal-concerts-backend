import { Router } from 'express';
import { concertSchema, concertUpdateSchema } from '../schemas/auth/create-concerts.schema.js';
import { checkOwnerShip } from '../middleware/check-owner-ship.middleware.js';
import { validateSchema } from '../middleware/validator-schema.middleware.js';
import { checkBandStatus } from '../middleware/check-role.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  createConcertController,
  deleteConcertController,
  getAllConcertsController,
  getConcertByIdController,
  getGenresController,
  getMostPopularConcertsController,
  getLocationsController,
  getTopRatedConcertsController,
  getUpcomingConcertsController,
  updateConcertController
} from '../controllers/concerts/concert.controller.js';

const router = Router();

router.post('/', authRequired, checkBandStatus('approved'), validateSchema(concertSchema), upload.single('file'), createConcertController);
router.get('/genres', getGenresController);
router.get('/locations', getLocationsController);
router.get('/recent', getUpcomingConcertsController);
router.get('/most-popular', getMostPopularConcertsController);
router.get('/top-rated', getTopRatedConcertsController);
router.delete('/:id', authRequired, checkBandStatus('approved'), checkOwnerShip, deleteConcertController);
router.put('/:id', authRequired, checkBandStatus('approved'), checkOwnerShip, validateSchema(concertUpdateSchema), updateConcertController);
router.get('/', authRequired, getAllConcertsController);
router.get('/:id', getConcertByIdController);

export default router;
