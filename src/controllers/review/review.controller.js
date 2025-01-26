import Review from '../../models/review.model.js';
import Concert from '../../models/concerts.model.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';

export const createReviewController = async (req, res) => {
  try {
    const { concertId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const concert = await Concert.findById(concertId);
    if (!concert) return errorResponse(res, 400, 'Concert not found');

    // TODO Solo se pueden valorar conciertos PASADOS
    if (new Date(concert.date) > new Date()) {
      return errorResponse(res, 400, 'You can only review past concerts');
    }

    // TODO Evitar que un usuario valore más de una vez el mismo concierto
    const existingReview = await Review.findOne({ user: userId, concert: concertId });
    if (existingReview) return errorResponse(res, 400, 'You have already reviewed this concert');

    const newReview = new Review({
      user: userId,
      concert: concertId,
      rating,
      comment
    });

    await newReview.save();

    await updateConcertRatingController(concertId);

    return successResponse(res, 'Review created successfully.', newReview);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

const updateConcertRatingController = async (concertId) => {
  try {
    const reviews = await Review.find({ concert: concertId });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    await Concert.findByIdAndUpdate(concertId, { averageRating: averageRating.toFixed(1) });
  } catch (error) {
    console.error('Error updating concert rating:', error);
  }
};

export const getConcertReviewsController = async (req, res) => {
  try {
    const { concertId } = req.params;

    const reviews = await Review.find({ concert: concertId }).populate('user', 'username').select('rating comment createdAt');

    res.status(200).json(reviews);
    return successResponse(res, 'Reviews retrieved successfully', reviews);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getConcertRatingController = async (req, res) => {
  try {
    const { concertId } = req.params;

    const reviews = await Review.find({ concert: concertId });
    if (reviews.length === 0) {
      return successResponse(res, 'No reviews yet', { averageRating: 0, totalReviews: 0 });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return successResponse(res, 'Average rating calculated successfully', {
      averageRating: averageRating.toFixed(1),
      totalReviews: reviews.length
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const updateReviewController = async (req, res) => {
  try {
    const { concertId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ user: userId, concert: concertId });
    if (!review) return errorResponse(res, 404, 'Review not found');
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    await updateConcertRatingController(concertId);

    return successResponse(res, 'Review updated successfully', concertId);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const deleteReviewController = async (req, res) => {
  try {
    const { concertId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({ user: userId, concert: concertId });
    if (!review) return errorResponse(res, 404, 'Review not found');

    await updateConcertRatingController(concertId);

    return successResponse(res, 'Review delete successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
