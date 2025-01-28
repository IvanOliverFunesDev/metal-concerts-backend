import { Router } from 'express';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { checkUserRole, checkBandStatus } from '../middleware/check-role.middleware.js';
import {
  subscribeToBand,
  unsubscribeFromBand,
  getUserSubscriptions,
  getBandSubscribers
} from '../controllers/subscription.controller.js';

const router = Router();
router.post('/subscribe/:bandId', authRequired, checkUserRole('user'), checkBandStatus('approved'), subscribeToBand);
router.delete('/unsubscribe/:bandId', authRequired, checkUserRole('user'), unsubscribeFromBand);
router.get('/subscriptions', authRequired, checkUserRole('user'), getUserSubscriptions);

router.get('/subscribers', authRequired, checkBandStatus('approved'), getBandSubscribers);

export default router;
