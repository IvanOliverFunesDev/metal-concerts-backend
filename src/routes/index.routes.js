import { Router } from 'express';
import authRoutes from '../routes/auth.routes.js';
import concertRoutes from '../routes/concert.routes.js';
import userRoutes from '../routes/user.routes.js';
import subscriptionRoutes from '../routes/subscription.routes.js';
import bandRoutes from '../routes/band.routes.js';
import reviewRoutes from '../routes/review.routes.js';
import adminRoutes from '../routes/admin.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/concerts', concertRoutes);
router.use('/users', userRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/bands', bandRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);

export default router;
