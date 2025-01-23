import User from '../../models/user.model.js';
import Concert from '../../models/concerts.model.js';

export const profileUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteConcerts', 'title date location band').populate('subscribedBands', 'bandName genre image');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      favoriteConcerts: user.favoriteConcerts,
      subscribedBands: user.subscribedBands,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addFavoriteConcert = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const concert = await Concert.findById(req.params.concertId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!concert) return res.status(404).json({ message: 'Concert not found' });
    if (user.favoriteConcerts.includes(concert._id)) {
      return res.json({ message: 'Concert is already in favorites' });
    }
    user.favoriteConcerts.push(concert._id);
    await user.save();
    res.status(200).json({ message: 'Concert add to favorites', favoriteConcerts: user.favoriteConcerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFavoriteConcert = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favoriteConcerts = user.favoriteConcerts.filter(concertId => concertId.toString() !== req.params.concertId);
    await user.save();

    res.status(200).json({ message: 'Concert removed from favorites', favoriteConcerts: user.favoriteConcerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFavoriteConcerts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteConcerts');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ favoriteConcerts: user.favoriteConcerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
