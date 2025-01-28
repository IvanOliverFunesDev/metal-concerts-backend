import Band from '../../models/band.model.js';
import Concert from '../../models/concerts.model.js';
// eslint-disable-next-line no-unused-vars
import User from '../../models/user.model.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';

export const profileBandController = async (req, res) => {
  try {
    const user = await Band.findById(req.user.id).populate('subscribers');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return successResponse(res, 'Your profile has been successfully loaded', {
      id: user._id,
      username: user.bandName,
      email: user.email,
      description: user.description,
      genre: user.genre,
      image: user.image,
      subscribers: user.subscribers,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getBandPublicProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim();
    const band = await Band.findById(cleanId);

    if (!band) return res.status(404).json({ message: 'Band not found' });

    const subscribersCount = band.subscribers ? band.subscribers.length : 0;

    const allConcerts = await Concert.find({ band: cleanId }).select('title date location');

    const upcomingConcerts = allConcerts
      .filter(concert => concert.date >= new Date())
      .map(concert => ({
        id: concert._id,
        title: concert.title,
        date: concert.date,
        location: concert.location
      }));

    const pastConcerts = allConcerts
      .filter(concert => concert.date < new Date())
      .map(concert => ({
        id: concert._id,
        title: concert.title,
        date: concert.date,
        location: concert.location,
        message: 'This concert has ended'
      }));

    return successResponse(res, 'Band profile loaded successfully', {
      id: band._id,
      bandName: band.bandName,
      genre: band.genre,
      description: band.description,
      image: band.image,
      subscribersCount,
      upcomingConcerts,
      pastConcerts
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getAllBandsController = async (req, res) => {
  try {
    const { bandName, genre } = req.query;
    const filters = { status: 'approved' };

    if (bandName) {
      filters.bandName = { $regex: `.*${bandName}.*`, $options: 'i' };
    }

    if (genre) {
      filters.genre = { $regex: `.*${genre}.*`, $options: 'i' };
    }

    const bands = await Band.find(filters).select('bandName genre description image subscribers');

    const formattedBands = bands.map(band => ({
      id: band._id,
      bandName: band.bandName,
      genre: band.genre,
      description: band.description,
      image: band.image,
      subscribersCount: band.subscribers ? band.subscribers.length : 0
    }));

    return successResponse(res, 'All bands retrieved successfully', formattedBands);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const updateBandProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const { bandName, genre, description, image } = req.body;

    const band = await Band.findById(id.trim());
    if (!band) {
      return errorResponse(res, 404, 'Band not found');
    }

    if (band._id.toString() !== req.user.id) {
      return errorResponse(res, 403, 'Unauthorized: You can only update your own band profile');
    }

    band.bandName = bandName || band.bandName;
    band.genre = genre || band.genre;
    band.description = description || band.description;
    band.image = image || band.image;

    await band.save();

    return successResponse(res, 'Band profile update successfully', {
      band: {
        id: band._id,
        bandName: band.bandName,
        genre: band.genre,
        description: band.description,
        image: band.image
      }
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
