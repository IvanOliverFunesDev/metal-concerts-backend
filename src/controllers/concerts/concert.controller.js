import Concert from '../../models/concerts.model.js';
import Band from '../../models/band.model.js';
import { errorResponse, successResponse } from '../../utils/responseHelper.js';

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

    return successResponse(res, 'Concerts retrieved successfully', concerts);
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

    return successResponse(res, 'Concert details retrieved successfully', {
      id: concert._id,
      title: concert.title,
      description: concert.description,
      date: concert.date,
      location: concert.location,
      band: {
        bandId: concert.band._id,
        bandName: concert.band.bandName,
        genre: concert.band.genre,
        image: concert.band.image,
        subscribersCount
      }
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const createConcertController = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const newConcert = new Concert({
      title,
      description,
      date,
      location,
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

export const getUpcomingConcertsController = async (req, res) => {
  try {
    const today = new Date(); // 📌 Obtener la fecha actual

    const upcomingConcerts = await Concert.find({ date: { $gte: today } }) // 🔥 Solo eventos futuros
      .populate('band', 'bandName genre image')
      .sort({ date: 1 }) // 🔥 Ordenar por fecha ascendente (próximos eventos primero)
      .limit(4); // 🔥 Mostrar solo 4 conciertos

    return successResponse(res, 'Concert ', upcomingConcerts);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getHighlightedConcertsController = async (req, res) => {
  try {
    // 🔥 Obtener las bandas con más suscriptores
    const topBands = await Band.find().sort({ subscribers: -1 }).limit(5);

    if (!topBands.length) {
      return errorResponse(res, 404, 'No bands found');
    }

    // 🔥 Obtener conciertos de esas bandas
    const highlightedConcerts = await Concert.find({
      band: { $in: topBands.map(band => band._id) }
    })
      .populate('band', 'bandName genre image subscribers')
      .sort({ 'band.subscribers': -1 })
      .limit(4);

    return successResponse(res, 'Concerts retrieved successfully', highlightedConcerts);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getGenresController = async (req, res) => {
  try {
    const genres = await Band.distinct('genre');
    if (!genres) return errorResponse(res, 404, 'Band not found');
    return successResponse(res, 'Lista de generos:', { genres });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getLocationsController = async (req, res) => {
  try {
    const locations = await Concert.distinct('location');
    if (!locations) return errorResponse(res, 404, 'Locations not found');
    return successResponse(res, 'Lista de localizaciones:', { locations });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error'[{ message: error.message }]);
  }
};
