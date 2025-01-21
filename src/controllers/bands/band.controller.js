import Band from '../../models/band.model.js';
// eslint-disable-next-line no-unused-vars
import User from '../../models/user.model.js';

export const profileBandController = async (req, res) => {
  try {
    const user = await Band.findById(req.user.id).populate('subscribers');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
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
    res.status(500).json({ message: error.message });
  }
};
