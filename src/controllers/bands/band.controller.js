import Band from '../../models/band.model.js';
import Concert from '../../models/concerts.model.js';
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

export const getBandPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const cleanId = id.trim();
    const band = await Band.findById(cleanId);
    if (!band) return res.status(404).json({ message: 'Band not found' });

    const subscribersCount = band.subscribers ? band.subscribers.length : 0;

    const concerts = await Concert.find({ band: cleanId }).select('title date location');
    res.status(200).json({
      id: band._id,
      bandName: band.bandName,
      genre: band.genre,
      description: band.description,
      image: band.image,
      subscribersCount,
      concerts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBands = async (req, res) => {
  try {
    const bands = await Band.find().select('bandName genre description image subscribers');

    const formattedBands = bands.map(band => ({
      id: band._id,
      bandName: band.bandName,
      genre: band.genre,
      description: band.description,
      image: band.image,
      subscribersCount: band.subscribers ? band.subscribers.length : 0
    }));

    res.status(200).json(formattedBands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBandProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { bandName, genre, description, image } = req.body;

    const band = await Band.findById(id.trim());
    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }

    if (band._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own band profile' });
    }

    band.bandName = bandName || band.bandName;
    band.genre = genre || band.genre;
    band.description = description || band.description;
    band.image = image || band.image;

    await band.save();

    res.status(200).json({
      message: 'Band profile updated successfully',
      band: {
        id: band._id,
        bandName: band.bandName,
        genre: band.genre,
        description: band.description,
        image: band.image
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
