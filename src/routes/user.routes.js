import { Router } from 'express';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { addFavoriteConcert } from '../controllers/users/user.controller.js';

const router = Router();

router.post('/favorites/:concertId', authRequired, addFavoriteConcert);

export default router;
