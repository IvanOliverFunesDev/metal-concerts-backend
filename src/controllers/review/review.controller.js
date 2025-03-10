import Review from '../../models/review.model.js';
import Concert from '../../models/concerts.model.js';
import Band from '../../models/band.model.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';

export const createReviewController = async (req, res) => {
  try {
    const { concertId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const concert = await Concert.findById(concertId).populate('band');
    if (!concert) return errorResponse(res, 400, 'Concert not found');

    // 🔹 Solo se pueden valorar conciertos PASADOS
    if (new Date(concert.date) > new Date()) {
      return errorResponse(res, 400, 'You can only review past concerts');
    }

    // 🔹 Evitar que un usuario valore más de una vez el mismo concierto
    const existingReview = await Review.findOne({ user: userId, concert: concertId });
    if (existingReview) return errorResponse(res, 400, 'You have already reviewed this concert');

    // 🔹 Guardar la reseña
    const newReview = new Review({
      user: userId,
      concert: concertId,
      rating,
      comment
    });

    await newReview.save();

    // 🔹 Actualizar el rating del concierto
    await updateConcertRatingController(concertId);

    // 🔹 Obtener la banda del concierto
    const bandId = concert.band._id;

    // 🔹 Recalcular la media de valoraciones de la banda
    await updateBandRatingController(bandId);

    return successResponse(res, 'Review created successfully.', newReview);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const updateBandRatingController = async (bandId) => {
  try {
    // 1️⃣ Buscar todos los conciertos de la banda
    const concerts = await Concert.find({ band: bandId });

    if (!concerts || concerts.length === 0) {
      return await Band.findByIdAndUpdate(bandId, { averageRating: 0, totalReviews: 0 });
    }

    // 2️⃣ Obtener todas las reviews de los conciertos de la banda
    const concertIds = concerts.map(concert => concert._id);
    const reviews = await Review.find({ concert: { $in: concertIds } });

    if (!reviews || reviews.length === 0) {
      return await Band.findByIdAndUpdate(bandId, { averageRating: 0, totalReviews: 0 });
    }

    // 3️⃣ Calcular el promedio de rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // 4️⃣ Actualizar la banda con los nuevos valores
    await Band.findByIdAndUpdate(bandId, {
      averageRating: averageRating.toFixed(1),
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('❌ Error updating band rating:', error);
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
    return successResponse(res, 'Reviews retrieved successfully', reviews);
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

    // 🔹 Buscar el concierto para obtener su banda
    const concert = await Concert.findById(concertId).populate('band');
    if (!concert) return errorResponse(res, 400, 'Concert not found');

    // ✅ Recalcular la media de valoraciones del concierto
    await updateConcertRatingController(concertId);

    // ✅ Recalcular la media de valoraciones de la banda
    const bandId = concert.band._id;
    await updateBandRatingController(bandId);

    return successResponse(res, 'Review updated successfully', review);
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

    // 🔹 Buscar el concierto para obtener su banda
    const concert = await Concert.findById(concertId).populate('band');
    if (!concert) return errorResponse(res, 400, 'Concert not found');

    // ✅ Recalcular la media de valoraciones del concierto
    await updateConcertRatingController(concertId);

    // ✅ Recalcular la media de valoraciones de la banda
    const bandId = concert.band._id;
    await updateBandRatingController(bandId);

    return successResponse(res, 'Review deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
