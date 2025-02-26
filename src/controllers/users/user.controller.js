import User from '../../models/user.model.js';
import Concert from '../../models/concerts.model.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';

export const profileUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 'Your profile has been successfully loaded', {
      id: user._id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const addFavoriteConcert = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const concert = await Concert.findById(req.params.concertId);
    if (!user) return errorResponse(res, 404, 'User not found');
    if (!concert) return errorResponse(res, 404, 'Concert not found');
    if (user.favoriteConcerts.includes(concert._id)) {
      return errorResponse(res, 409, 'Concert is already in favorites');
    }
    user.favoriteConcerts.push(concert._id);
    await user.save();
    return successResponse(res, 'Concert added to favorites', {
      favoriteConcerts: user.favoriteConcerts
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const removeFavoriteConcert = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 404, 'User not found');

    const concertId = req.params.concertId;

    if (!user.favoriteConcerts.some(id => id.toString() === concertId)) {
      return errorResponse(res, 400, 'This concert is not in your favorites');
    }

    user.favoriteConcerts = user.favoriteConcerts.filter(id => id.toString() !== concertId);
    await user.save();

    return successResponse(res, 'Concert remove from favorites');
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getFavoriteConcerts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favoriteConcerts',
      populate: { path: 'band', select: 'bandName genre image' }
    });
    if (!user) return errorResponse(res, 404, 'User not found');
    const formattedConcerts = user.favoriteConcerts.map(concert => ({
      id: concert._id, // Convertimos `_id` en `id`
      title: concert.title,
      description: concert.description,
      date: concert.date,
      location: concert.location,
      image: concert.image,
      band: concert.band, // `band` ya tiene los campos filtrados (bandName, genre, image)
      isFavorite: true
    }));
    return successResponse(res, 'List concerts successfully', {
      favoriteConcerts: formattedConcerts
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
