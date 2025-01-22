import { Router } from 'express';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { addFavoriteConcert, removeFavoriteConcert } from '../controllers/users/user.controller.js';

const router = Router();

router.post('/favorites/:concertId', authRequired, addFavoriteConcert);
router.delete('/favorites/:concertId', authRequired, removeFavoriteConcert);

export default router;
