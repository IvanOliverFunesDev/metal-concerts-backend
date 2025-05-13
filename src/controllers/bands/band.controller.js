import Band from '../../models/band.model.js';
import Concert from '../../models/concerts.model.js';
// eslint-disable-next-line no-unused-vars
import User from '../../models/user.model.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../../services/cloudinary.service.js';
import { markSubscribeBands } from '../../utils/concertsUtils.js';

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

    const formattedBand = await markSubscribeBands(band, req.user?.id);
    return successResponse(res, 'Band profile loaded successfully', {
      ...formattedBand,
      subscribersCount,
      upcomingConcerts,
      pastConcerts,
      averageRating: band.averageRating,
      totalReviews: band.totalReviews,
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getOwnBandController = async (req, res) => {
  try {
    const bandId = req.user?.id;

    if (!bandId) return res.status(401).json({ message: 'No autorizado' });

    const band = await Band.findById(bandId);

    if (!band) return res.status(404).json({ message: 'Band not found' });

    const subscribersCount = band.subscribers ? band.subscribers.length : 0;

    const allConcerts = await Concert.find({ band: bandId }).select('title date location');

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

    const formattedBand = await markSubscribeBands(band, req.user.id);

    return successResponse(res, 'Private band panel loaded successfully', {
      ...formattedBand,
      subscribersCount,
      upcomingConcerts,
      pastConcerts,
      averageRating: band.averageRating,
      totalReviews: band.totalReviews,
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

    const bands = await Band.find(filters).select('bandName genre description image subscribers averageRating totalReviews');

    const formattedBands = await markSubscribeBands(bands, req.user?.id);

    return successResponse(res, 'All bands retrieved successfully', formattedBands);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const updateBandProfileController = async (req, res) => {
  try {
    const bandId = req.user.id;
    const { bandName, genre, description } = req.body;
    const band = await Band.findById(bandId);

    if (!band) {
      return errorResponse(res, 404, 'Band not found');
    }
    // 🔥 Si hay una nueva imagen en la request
    let imageUrl = band.image;
    if (req.file) {
      console.log('🖼 Recibida imagen:', req.file);
      if (band.image) {
        console.log('🗑 Borrando imagen anterior de Cloudinary:', band.image);

        await deleteImageFromCloudinary(band.image); // 🗑️ Borrar imagen anterior
      }
      const uploadResult = await uploadImageToCloudinary(req.file.path);

      imageUrl = uploadResult.secure_url;
    }

    // 🔹 Actualizar datos de la banda
    band.bandName = bandName || band.bandName;
    band.genre = genre || band.genre;
    band.description = description || band.description;
    band.image = imageUrl; // 📌 Guardar la nueva imagen en la BD

    await band.save();

    return successResponse(res, 'Band profile updated successfully', {
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

export const getPopularBandsController = async (req, res) => {
  try {
    const { limit } = req.query;
    const bandLimit = limit && limit !== 'all' ? parseInt(limit) : 0;

    const popularBands = await Band.find()
      .select('bandName genre image subscribers') // Solo obtenemos estos campos
      .lean(); // Convierte el resultado a objetos JavaScript simples

    // Ordenamos manualmente por la cantidad de suscriptores
    popularBands.sort((a, b) => b.subscribers.length - a.subscribers.length);

    // Aplicamos el límite si hay uno
    const limitedBands = bandLimit > 0 ? popularBands.slice(0, bandLimit) : popularBands;

    // Formateamos la respuesta
    const formattedBands = await markSubscribeBands(limitedBands, req.user?.id);

    if (formattedBands.length === 0) {
      return errorResponse(res, 404, 'No bands found');
    }

    return successResponse(res, 'All bands retrieved successfully', formattedBands);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getTopRatedBandsController = async (req, res) => {
  try {
    const { limit } = req.query;
    const bandLimit = limit && limit !== 'all' ? parseInt(limit) : 0;

    const topRatedBands = await Band.find()
      .select('bandName genre image averageRating') // Solo obtenemos estos campos
      .lean(); // Convierte el resultado a objetos JavaScript simples

    // Ordenamos manualmente por la cantidad de suscriptores
    topRatedBands.sort((a, b) => b.averageRating - a.averageRating);

    // Aplicamos el límite si hay uno
    const limitedBands = bandLimit > 0 ? topRatedBands.slice(0, bandLimit) : topRatedBands;

    // Formateamos la respuesta
    const formattedBands = await markSubscribeBands(limitedBands, req.user?.id);

    if (formattedBands.length === 0) {
      return errorResponse(res, 404, 'No bands found');
    }

    return successResponse(res, 'All bands retrieved successfully', formattedBands);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
