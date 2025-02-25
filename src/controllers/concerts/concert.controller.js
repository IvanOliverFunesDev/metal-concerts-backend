import Concert from '../../models/concerts.model.js';
import Band from '../../models/band.model.js';
import User from '../../models/user.model.js';
import { errorResponse, successResponse } from '../../utils/responseHelper.js';
import { GENRES } from '../../constants/genres.js';
import { LOCATIONS } from '../../constants/locations.js';
import { uploadImageToCloudinary } from '../../services/cloudinary.service.js';

// 🎵 CONCERT CONTROLLERS
export const getAllConcertsController = async (req, res) => {
  try {
    const { title, location, date, bandName, genre } = req.query;
    const filters = { date: { $gte: new Date() } };

    if (title) {
      const cleanTitle = title.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filters.title = { $regex: `.*${cleanTitle}.*`, $options: 'i' };
    }

    if (location) {
      const cleanLocation = location.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      filters.location = { $regex: `.*${cleanLocation}.*`, $options: 'i' };
    }

    if (date) {
      filters.date = new Date(date);
    }

    let bandIds = [];

    if (bandName) {
      const cleanBandName = bandName.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const bands = await Band.find({ bandName: { $regex: `.*${cleanBandName}.*`, $options: 'i' } });

      if (bands.length > 0) {
        bandIds = bands.map(band => band._id);
      } else {
        return errorResponse(res, 404, 'No bands found with the provided name');
      }
    }

    if (genre) {
      const cleanGenre = genre.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const bandsByGenre = await Band.find({ genre: { $regex: `.*${cleanGenre}.*`, $options: 'i' } });

      if (bandsByGenre.length > 0) {
        const genreBandIds = bandsByGenre.map(band => band._id);
        bandIds = [...new Set([...bandIds, ...genreBandIds])];
      } else {
        return errorResponse(res, 404, 'No bands found with the provided genre');
      }
    }

    if (bandIds.length > 0) {
      filters.band = { $in: bandIds };
    }

    const concerts = await Concert.find(filters).populate('band', 'bandName genre image');

    if (concerts.length === 0) {
      return errorResponse(res, 404, 'No concerts found matching the search criteria');
    }

    const userId = req.user?.id;
    let favoriteConcerts = [];

    if (userId) {
      const user = await User.findById(userId).select('favoriteConcerts');
      if (user) {
        favoriteConcerts = new Set(user.favoriteConcerts.map(fav => fav.toString()));
      }
    }

    const formattedConcerts = concerts.map(concert => ({
      id: concert._id,
      title: concert.title,
      description: concert.description,
      date: concert.date,
      location: concert.location,
      image: concert.image,
      band: concert.band,
      isFavorite: favoriteConcerts.has(concert._id.toString())
    }));

    return successResponse(res, 'Concerts retrieved successfully', formattedConcerts);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getConcertByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim();

    const concert = await Concert.findById(cleanId).populate('band', 'bandName genre image subscribers');

    if (!concert) {
      return errorResponse(res, 404, 'Concert not found');
    }

    const subscribersCount = concert.band.subscribers ? concert.band.subscribers.length : 0;
    // 🔹 Buscar las bandas del mismo género, ordenadas por mejor rating
    const relatedBands = await Band.find({ genre: concert.band.genre }).sort({ averageRating: -1 }).limit(5);

    // 🔹 Obtener conciertos futuros de esas bandas
    const relatedConcerts = await Concert.find({
      band: { $in: relatedBands.map(band => band._id) },
      date: { $gte: new Date() } // 🔥 Solo conciertos futuros
    }).limit(5).populate('band', 'bandName genre image');

    const concertsOfSameBand = await Concert.find({
      band: concert.band._id, // Misma banda
      _id: { $ne: concert._id }, // Excluir el concierto actual
      date: { $gte: new Date() } // Solo futuros conciertos
    }).select('title date location image');

    return successResponse(res, 'Concert details retrieved successfully', {
      id: concert._id,
      title: concert.title,
      description: concert.description,
      date: concert.date,
      location: concert.location,
      image: concert.image,
      averageRating: concert.averageRating,
      band: {
        id: concert.band._id,
        bandName: concert.band.bandName,
        genre: concert.band.genre,
        image: concert.band.image,
        subscribersCount
      },
      relatedConcerts: relatedConcerts.map(concert => ({
        id: concert._id,
        title: concert.title,
        image: concert.image,
        description: concert.description,
        date: concert.date,
        location: concert.location,
        band: {
          id: concert.band._id,
          bandName: concert.band.bandName,
          genre: concert.band.genre,
          image: concert.band.image
        }
      })),
      concertsOfSameBand: concertsOfSameBand.map(concert => ({
        id: concert._id,
        title: concert.title,
        image: concert.image,
        date: concert.date
      }))
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

// 🎟️ CREATE, UPDATE & DELETE CONCERTS
export const createConcertController = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    let imageUrl = '';
    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file.path);
      imageUrl = uploadResult.secure_url;
    }
    const newConcert = new Concert({
      title,
      description,
      date,
      location,
      image: imageUrl,
      band: req.user.id
    });
    const savedConcert = await newConcert.save();
    return successResponse(res, 'Successfully created concert', savedConcert);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const updateConcertController = async (req, res) => {
  try {
    const updateConcert = await Concert.findByIdAndUpdate(req.params.id, req.body);
    if (!updateConcert) return res.json({ message: 'Concert not found' });
    return successResponse(res, 'Successfully updated concert', updateConcert);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const deleteConcertController = async (req, res) => {
  try {
    const deleteConcert = await Concert.findByIdAndDelete(req.params.id);
    if (!deleteConcert) return res.json({ message: 'Concert not found' });
    return successResponse(res, 'Concert deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

// 📅 UPCOMING & POPULAR CONCERTS
export const getUpcomingConcertsController = async (req, res) => {
  try {
    const today = new Date(); // 📌 Obtener la fecha actual

    const upcomingConcerts = await Concert.find({ date: { $gte: today } }) // 🔥 Solo eventos futuros
      .populate('band', 'bandName genre image')
      .sort({ date: 1 }) // 🔥 Ordenar por fecha ascendente (próximos eventos primero)
      .limit(4); // 🔥 Mostrar solo 4 conciertos

    const formattedConcerts = upcomingConcerts.map(concert => ({
      id: concert._id,
      title: concert.title,
      description: concert.description,
      date: concert.date,
      location: concert.location,
      image: concert.image,
      band: concert.band
    }));

    return successResponse(res, 'Concert ', formattedConcerts);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getTopRatedConcertsController = async (req, res) => {
  try {
    const { limit } = req.query;
    const concertLimit = limit && limit !== 'all' ? parseInt(limit) : 0;

    const topBands = await Band.find().sort({ averageRating: -1 }).select('bandName genre image averageRating').lean();

    if (!topBands.length) {
      return errorResponse(res, 404, 'No bands found');
    }
    const averageConcerts = await Concert.find({
      band: { $in: topBands.map(band => band._id) },
      date: { $gte: new Date() }
    }).sort({ date: 1 }) // Ordenamos para obtener los más próximos
      .populate('band', 'bandName genre image averageRating')
      .lean(); // Convertimos a objetos simples para ordenar correctamente
    const formattedConcerts = averageConcerts.map(concert => ({
      id: concert._id,
      title: concert.title,
      description: concert.description,
      date: concert.date,
      location: concert.location,
      image: concert.image,
      band: {
        id: concert.band._id,
        bandName: concert.band.bandName,
        genre: concert.band.genre,
        image: concert.band.image,
        averageRating: concert.band.averageRating
      }
    }));
    formattedConcerts.sort((a, b) => b.band.averageRating - a.band.averageRating);

    // 🔹 Aplicamos el límite si hay uno
    const finalConcerts = concertLimit > 0 ? formattedConcerts.slice(0, concertLimit) : formattedConcerts;

    if (!finalConcerts.length) {
      return errorResponse(res, 404, 'No highlighted concerts found');
    }

    return successResponse(res, 'Highlighted concerts retrieved successfully', finalConcerts);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getMostPopularConcertsController = async (req, res) => {
  try {
    const { limit } = req.query;
    const concertLimit = limit && limit !== 'all' ? parseInt(limit) : 0;

    // 🔥 Obtener las bandas con más suscriptores
    const topBands = await Band.find()
      .sort({ subscribers: -1 }) // Ordenar por suscriptores
      .select('bandName genre image subscribers') // Seleccionar solo estos campos
      .lean(); // Convertir a objetos JavaScript simples

    if (!topBands.length) {
      return errorResponse(res, 404, 'No bands found');
    }

    // 🔥 Obtener los conciertos más próximos de esas bandas
    const highlightedConcerts = await Concert.find({
      band: { $in: topBands.map(band => band._id) },
      date: { $gte: new Date() } // Solo conciertos futuros
    })
      .sort({ date: 1 }) // Ordenamos para obtener los más próximos
      .populate('band', 'bandName genre image subscribers')
      .lean(); // Convertimos a objetos simples para ordenar correctamente

    // 🔹 Formateamos la respuesta con los datos necesarios
    const formattedConcerts = highlightedConcerts.map(concert => ({
      id: concert._id,
      title: concert.title,
      description: concert.description,
      date: concert.date,
      location: concert.location,
      image: concert.image,
      band: {
        id: concert.band._id,
        bandName: concert.band.bandName,
        genre: concert.band.genre,
        image: concert.band.image,
        subscribersCount: concert.band.subscribers.length
      }
    }));

    // 🔥 Ordenamos por el número de suscriptores de la banda
    formattedConcerts.sort((a, b) => b.band.subscribersCount - a.band.subscribersCount);

    // 🔹 Aplicamos el límite si hay uno
    const finalConcerts = concertLimit > 0 ? formattedConcerts.slice(0, concertLimit) : formattedConcerts;

    if (!finalConcerts.length) {
      return errorResponse(res, 404, 'No highlighted concerts found');
    }

    return successResponse(res, 'Highlighted concerts retrieved successfully', finalConcerts);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

// 🎸 FILTERS (GENRES & LOCATIONS)
export const getGenresController = async (req, res) => {
  return successResponse(res, 'Genres retrieved successfully', GENRES);
};

export const getLocationsController = async (req, res) => {
  return successResponse(res, 'Locations retrieved successfully', LOCATIONS);
};
