import User from '../models/user.model.js';

export const markFavoriteConcerts = async (concerts, userId) => {
  let favoriteConcertsSet = new Set();

  if (userId) {
    const user = await User.findById(userId).select('favoriteConcerts');
    if (user) {
      favoriteConcertsSet = new Set(user.favoriteConcerts.map(fav => fav.toString()));
    }
  }

  // Si es un solo concierto, lo convertimos en un array temporalmente
  const concertsArray = Array.isArray(concerts) ? concerts : [concerts];

  const formattedConcerts = concertsArray.map(concert => ({
    id: concert._id,
    title: concert.title,
    description: concert.description,
    date: concert.date,
    location: concert.location,
    image: concert.image,
    band: concert.band,
    isFavorite: favoriteConcertsSet.has(concert._id.toString())
  }));

  return Array.isArray(concerts) ? formattedConcerts : formattedConcerts[0]; // Devolver lista o solo un objeto
};
