import { Router } from 'express';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { addFavoriteConcert, getFavoriteConcerts, removeFavoriteConcert } from '../controllers/users/user.controller.js';

const router = Router();

router.post('/favorites/:concertId', authRequired, addFavoriteConcert);
router.delete('/favorites/:concertId', authRequired, removeFavoriteConcert);
router.get('/favorites', authRequired, getFavoriteConcerts);
export default router;
