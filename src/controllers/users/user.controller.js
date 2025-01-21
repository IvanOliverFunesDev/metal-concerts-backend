import User from '../../models/user.model.js';
// eslint-disable-next-line no-unused-vars
import Concert from '../../models/concerts.model.js';

export const profileUserController = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoriteConcerts').populate('subscribedBands');
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
