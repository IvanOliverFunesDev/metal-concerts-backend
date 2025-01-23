import { Router } from 'express';

import { checkOwnerShip } from '../middleware/check-owner-ship.middleware.js';
import { validateSchema } from '../middleware/validator-schema.middleware.js';
import { checkRole } from '../middleware/check-role.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';

import {
  createConcertController,
  deleteConcertController,
  getAllConcertsController,
  getConcertByIdController,
  getHighlightedConcertsController,
  getUpcomingConcertsController,
  updateConcertController
} from '../controllers/concerts/concert.controller.js';
import { concertSchema, concertUpdateSchema } from '../schemas/auth/create-concerts.schema.js';

const router = Router();

router.post('/', authRequired, checkRole('band'), validateSchema(concertSchema), createConcertController);
router.delete('/:id', authRequired, checkRole('band'), checkOwnerShip, deleteConcertController);
router.put('/:id', authRequired, checkRole('band'), checkOwnerShip, validateSchema(concertUpdateSchema), updateConcertController);
router.get('/', getAllConcertsController);
router.get('/:id', getConcertByIdController);
router.get('/recent', getUpcomingConcertsController);
router.get('/highlighted', getHighlightedConcertsController);
export default router;
