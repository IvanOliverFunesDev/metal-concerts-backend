import User from '../models/user.model.js';
import Band from '../models/band.model.js';

export const subscribeToBand = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const band = await Band.findById(req.params.bandId);

    if (!band) return res.status(404).json({ message: 'Band not found' });

    if (user.subscribedBands.includes(band._id)) {
      return res.status(400).json({ message: 'You are already subscribed to this band' });
    }
    user.subscribedBands.push(band._id);
    band.subscribers.push(user.id);

    await user.save();
    await band.save();

    res.status(200).json({ message: 'Successfully subscribed to the band' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsubscribeFromBand = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const band = await Band.findById(req.params.bandId);
    if (!band) {
      return res.status(404).json({ message: 'Band not found' });
    }

    user.subscribedBands = user.subscribedBands?.filter(id => id.toString() !== band._id.toString()) || [];
    band.subscribers = band.subscribers?.filter(id => id.toString() !== user._id.toString()) || [];

    await user.save();
    await band.save();

    res.status(200).json({ message: 'Successfully unsubscribed from the band' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserSubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('subscribedBands', 'bandName image ');
    res.status(200).json(user.subscribedBands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBandSubscribers = async (req, res) => {
  try {
    const band = await Band.findById(req.user.id).populate('subscribers', 'username email');
    res.status(200).json(band.subscribers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
