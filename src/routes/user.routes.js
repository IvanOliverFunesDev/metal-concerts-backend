import { Router } from 'express';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { addFavoriteConcert, getFavoriteConcerts, removeFavoriteConcert } from '../controllers/users/user.controller.js';
import { checkUserRole } from '../middleware/check-role.middleware.js';

const router = Router();

router.post('/favorites/:concertId', authRequired, checkUserRole('user'), addFavoriteConcert);
router.delete('/favorites/:concertId', authRequired, checkUserRole('user'), removeFavoriteConcert);
router.get('/favorites', authRequired, checkUserRole('user'), getFavoriteConcerts);
export default router;
