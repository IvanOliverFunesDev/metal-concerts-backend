import { Router } from 'express';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { checkRole } from '../middleware/check-role.middleware.js';
import { subscribeToBand, unsubscribeFromBand, getUserSubscriptions, getBandSubscribers } from '../controllers/subscription.controller.js';

const router = Router();
router.post('/subscribe/:bandId', authRequired, checkRole('user'), subscribeToBand);
router.delete('/unsubscribe/:bandId', authRequired, checkRole('user'), unsubscribeFromBand);
router.get('/subscriptions', authRequired, checkRole('user'), getUserSubscriptions);

router.get('/subscribers', authRequired, checkRole('band'), getBandSubscribers);

export default router;
