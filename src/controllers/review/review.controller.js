import Review from '../../models/review.model.js';
import Concert from '../../models/concerts.model.js';

export const createReviewController = async (req, res) => {
  try {
    const { concertId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const concert = await Concert.findById(concertId);
    if (!concert) return res.status(404).json({ message: 'Concert not found' });

    // TODO Solo se pueden valorar conciertos PASADOS
    if (new Date(concert.date) > new Date()) {
      return res.status(400).json({ message: 'You can only review past concerts' });
    }

    // TODO Evitar que un usuario valore más de una vez el mismo concierto
    const existingReview = await Review.findOne({ user: userId, concert: concertId });
    if (existingReview) return res.status(400).json({ message: 'You have already reviewed this concert' });

    const newReview = new Review({
      user: userId,
      concert: concertId,
      rating,
      comment
    });
    await newReview.save();

    await updateConcertRatingController(concertId);

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConcertRatingController = async (req, res) => {
  try {
    const { concertId } = req.params;

    const reviews = await Review.find({ concert: concertId });
    if (reviews.length === 0) {
      return res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.status(200).json({ averageRating: averageRating.toFixed(1), totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReviewController = async (req, res) => {
  try {
    const { concertId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({ user: userId, concert: concertId });
    if (!review) return res.status(400).json({ message: 'Review not found' });
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    await updateConcertRatingController(concertId);

    res.status(200).json(concertId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReviewController = async (req, res) => {
  try {
    const { concertId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOneAndDelete({ user: userId, concert: concertId });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    await updateConcertRatingController(concertId);

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
