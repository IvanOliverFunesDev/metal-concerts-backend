import Concert from '../../models/concerts.model.js';
import Band from '../../models/band.model.js';
import { errorResponse, successResponse } from '../../utils/responseHelper.js';
import { GENRES } from '../../constants/genres.js';
import { LOCATIONS } from '../../constants/locations.js';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../../services/cloudinary.service.js';
import { markFavoriteConcerts } from '../../utils/concertsUtils.js';
import { notifySubscribers } from '../../utils/notifySubscribers.js';

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

    const formattedConcerts = await markFavoriteConcerts(concerts, req.user?.id);

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

    const concertWithFavorite = await markFavoriteConcerts(concert, req.user?.id);
    const relatedConcertsWithFavorite = await markFavoriteConcerts(relatedConcerts, req.user?.id);
    const concertsOfSameBandWithFavorite = await markFavoriteConcerts(concertsOfSameBand, req.user?.id);

    return successResponse(res, 'Concert details retrieved successfully', {
      id: concertWithFavorite.id,
      title: concertWithFavorite.title,
      description: concertWithFavorite.description,
      date: concertWithFavorite.date,
      location: concertWithFavorite.location,
      image: concertWithFavorite.image,
      averageRating: concertWithFavorite.averageRating,
      isFavorite: concertWithFavorite.isFavorite, // ✅ Aquí agregamos `isFavorite`
      band: {
        id: concert.band._id,
        bandName: concert.band.bandName,
        genre: concert.band.genre,
        image: concert.band.image,
        subscribersCount
      },
      relatedConcerts: relatedConcertsWithFavorite.map(concert => ({
        id: concert.id,
        title: concert.title,
        image: concert.image,
        description: concert.description,
        date: concert.date,
        location: concert.location,
        band: concert.band,
        isFavorite: concert.isFavorite // ✅ Se mantiene en los conciertos relacionados
      })),
      concertsOfSameBand: concertsOfSameBandWithFavorite.map(concert => ({
        id: concert.id,
        title: concert.title,
        image: concert.image,
        date: concert.date,
        isFavorite: concert.isFavorite // ✅ Se mantiene en los conciertos de la misma banda
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

    // 🔔 Notificar a suscriptores
    const band = await Band.findById(req.user.id);
    if (band) {
      await notifySubscribers(
        band,
        '🎤 Nuevo concierto publicado',
        `
          <h2>🎶 ¡Nuevo concierto disponible!</h2>
          <p>La banda <strong>${band.bandName}</strong> ha publicado un nuevo concierto:</p>
          <ul>
            <li><b>Título:</b> ${title}</li>
            <li><b>Fecha:</b> ${new Date(date).toLocaleDateString()}</li>
            <li><b>Lugar:</b> ${location}</li>
          </ul>
          <p>¡No te lo pierdas!</p>
        `
      );
    }

    return successResponse(res, 'Successfully created concert', savedConcert);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};


export const updateConcertController = async (req, res) => {
  try {
    const concertId = req.params.id;
    const concert = await Concert.findById(concertId);

    if (!concert) {
      return errorResponse(res, 404, 'Concert not found');
    }

    if (req.file) {
      console.log('🖼 Nueva imagen recibida:', req.file.path);

      if (concert.image) {
        console.log('🗑 Borrando imagen anterior:', concert.image);
        await deleteImageFromCloudinary(concert.image);
      }

      const uploadResult = await uploadImageToCloudinary(req.file.path);
      concert.image = uploadResult.secure_url;
    }

    Object.keys(req.body).forEach((key) => {
      concert[key] = req.body[key];
    });

    await concert.save();

    // 🔔 Notificar a suscriptores del cambio
    const band = await Band.findById(concert.band);
    if (band) {
      await notifySubscribers(
        band,
        '✏️ Concierto actualizado',
        `
          <h2>🎵 Concierto actualizado</h2>
          <p>La banda <strong>${band.bandName}</strong> ha actualizado uno de sus conciertos:</p>
          <ul>
            <li><b>Título:</b> ${concert.title}</li>
            <li><b>Fecha:</b> ${new Date(concert.date).toLocaleDateString()}</li>
            <li><b>Lugar:</b> ${concert.location}</li>
          </ul>
          <p>¡Mantente al tanto de los cambios!</p>
        `
      );
    }

    return successResponse(res, 'Concert updated successfully', concert);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};


export const deleteConcertController = async (req, res) => {
  try {
    const deleteConcert = await Concert.findByIdAndDelete(req.params.id);
    if (!deleteConcert) return res.json({ message: 'Concert not found' });

    // 🔔 Notificar a suscriptores
    const band = await Band.findById(deleteConcert.band);
    if (band) {
      await notifySubscribers(
        band,
        '❌ Concierto cancelado',
        `
          <h2>⚠️ Concierto cancelado</h2>
          <p>La banda <strong>${band.bandName}</strong> ha cancelado uno de sus conciertos:</p>
          <ul>
            <li><b>Título:</b> ${deleteConcert.title}</li>
            <li><b>Fecha:</b> ${new Date(deleteConcert.date).toLocaleDateString()}</li>
            <li><b>Lugar:</b> ${deleteConcert.location}</li>
          </ul>
          <p>Lamentamos los inconvenientes.</p>
        `
      );
    }

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

    const formattedConcerts = await markFavoriteConcerts(upcomingConcerts, req.user?.id);

    return successResponse(res, 'Concerts retrieved successfully', formattedConcerts);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getTopRatedConcertsController = async (req, res) => {
  try {
    const { limit } = req.query;
    const concertLimit = limit && limit !== 'all' ? parseInt(limit) : 0;

    // 🔹 Obtener las bandas con mejor rating
    const topBands = await Band.find()
      .sort({ averageRating: -1 })
      .select('bandName genre image averageRating')
      .lean();

    if (!topBands.length) {
      return errorResponse(res, 404, 'No bands found');
    }

    // 🔹 Obtener los conciertos de esas bandas con mejor rating
    const averageConcerts = await Concert.find({
      band: { $in: topBands.map(band => band._id) },
      date: { $gte: new Date() }
    })
      .sort({ date: 1 }) // 🔥 Conciertos más próximos primero
      .populate('band', 'bandName genre image averageRating')
      .lean(); // 🔥 Convertir a objetos simples para mejor manejo

    if (!averageConcerts.length) {
      return errorResponse(res, 404, 'No highlighted concerts found');
    }

    // 🔹 Aplicamos `markFavoriteConcerts` para añadir `isFavorite`
    const concertsWithFavorites = await markFavoriteConcerts(averageConcerts, req.user?.id);

    // 🔹 Ordenamos por la banda con mejor rating
    concertsWithFavorites.sort((a, b) => b.band.averageRating - a.band.averageRating);

    // 🔹 Aplicamos el límite si hay uno
    const finalConcerts = concertLimit > 0 ? concertsWithFavorites.slice(0, concertLimit) : concertsWithFavorites;

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
      .sort({ subscribers: -1 }) // Ordenar por más suscriptores primero
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
      .sort({ date: 1 }) // 🔥 Ordenar por fecha de concierto más cercana
      .populate('band', 'bandName genre image subscribers')
      .lean(); // 🔥 Convertir a objetos simples para mejor manipulación

    if (!highlightedConcerts.length) {
      return errorResponse(res, 404, 'No highlighted concerts found');
    }

    // 🔹 Aplicamos `markFavoriteConcerts` para incluir `isFavorite`
    const concertsWithFavorites = await markFavoriteConcerts(highlightedConcerts, req.user?.id);

    // 🔥 Ordenamos por el número de suscriptores de la banda
    concertsWithFavorites.sort((a, b) => b.band.subscribers.length - a.band.subscribers.length);

    // 🔹 Aplicamos el límite si hay uno
    const finalConcerts = concertLimit > 0 ? concertsWithFavorites.slice(0, concertLimit) : concertsWithFavorites;

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
