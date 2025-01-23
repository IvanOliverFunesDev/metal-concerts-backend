import { Router } from 'express';
import { createConcertController, deleteConcertController, getAllConcertsController, updateConcertController } from '../controllers/concerts/concert.controller.js';
import { checkOwnerShip } from '../middleware/check-owner-ship.middleware.js';
import { checkRole } from '../middleware/check-role.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';

const router = Router();

router.post('/', authRequired, checkRole('band'), createConcertController);
router.delete('/:id', authRequired, checkRole('band'), checkOwnerShip, deleteConcertController);
router.get('/', getAllConcertsController);
router.put('/:id', authRequired, checkRole('band'), checkOwnerShip, updateConcertController);

export default router;
