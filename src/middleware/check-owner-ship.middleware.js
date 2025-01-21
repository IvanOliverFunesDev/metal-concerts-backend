import Concert from '../models/concerts.model.js';

export const checkOwnership = async (req, res, next) => {
  try {
    const concert = await Concert.findById(req.params.id);
    if (!concert) return res.status(404).json({ message: 'Concert not found' });

    if (concert.band.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not the owner of this concert' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
