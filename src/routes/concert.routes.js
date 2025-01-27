import { Router } from 'express';
import { concertSchema, concertUpdateSchema } from '../schemas/auth/create-concerts.schema.js';
import { checkOwnerShip } from '../middleware/check-owner-ship.middleware.js';
import { validateSchema } from '../middleware/validator-schema.middleware.js';
import { checkRole } from '../middleware/check-role.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';
import {
  createConcertController,
  deleteConcertController,
  getAllConcertsController,
  getConcertByIdController,
  getGenresController,
  getHighlightedConcertsController,
  getLocationsController,
  getUpcomingConcertsController,
  updateConcertController
} from '../controllers/concerts/concert.controller.js';

const router = Router();

router.post('/', authRequired, checkRole('band'), validateSchema(concertSchema), createConcertController);
router.get('/genres', getGenresController);
router.get('/locations', getLocationsController);
router.get('/recent', getUpcomingConcertsController);
router.get('/highlighted', getHighlightedConcertsController);
router.delete('/:id', authRequired, checkRole('band'), checkOwnerShip, deleteConcertController);
router.put('/:id', authRequired, checkRole('band'), checkOwnerShip, validateSchema(concertUpdateSchema), updateConcertController);
router.get('/', getAllConcertsController);
router.get('/:id', getConcertByIdController);

export default router;
