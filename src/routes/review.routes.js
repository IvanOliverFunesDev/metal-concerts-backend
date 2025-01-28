import { Router } from 'express';
import { reviewSchema } from '../schemas/auth/review.schema.js';
import { validateSchema } from '../middleware/validator-schema.middleware.js';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { checkUserRole } from '../middleware/check-role.middleware.js';

import {
  createReviewController,
  deleteReviewController,
  getConcertRatingController,
  getConcertReviewsController,
  updateReviewController,
} from '../controllers/review/review.controller.js';

const router = Router();
router.post('/:concertId', authRequired, checkUserRole('user'), validateSchema(reviewSchema), createReviewController);
router.put('/:concertId', authRequired, checkUserRole('user'), validateSchema(reviewSchema), updateReviewController);
router.delete('/:concertId', authRequired, checkUserRole('user'), deleteReviewController);
router.get('/:concertId', getConcertReviewsController);
router.get('/:concertId/rating', getConcertRatingController);

export default router;
