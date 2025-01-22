import Concert from '../../models/concerts.model.js';
import Band from '../../models/band.model.js';

export const getAllConcertsController = async (req, res) => {
  try {
    const { title, location, date, bandName } = req.query;
    const filters = {};

    if (title) {
      filters.title = { $regex: title, $options: 'i' };
    }

    if (location) {
      filters.location = { $regex: location, $options: 'i' };
    }

    if (date) {
      filters.date = new Date(date);
    }

    if (bandName) {
      const band = await Band.findOne({ bandName: { $regex: bandName, $options: 'i' } });
      if (band) {
        filters.band = band._id;
      } else {
        return res.status(404).json({ message: 'Band not found' });
      }
    }

    const concerts = await Concert.find(filters).populate('band', 'bandName genre');
    res.status(200).json(concerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(201).json(savedConcert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateConcertController = async (req, res) => {
  try {
    const updateConcert = await Concert.findByIdAndUpdate(req.params.id, req.body);
    if (!updateConcert) return res.json({ message: 'Concert not found' });
    res.status(200).json(updateConcert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteConcertController = async (req, res) => {
  try {
    const deleteConcert = await Concert.findByIdAndDelete(req.params.id);
    if (!deleteConcert) return res.json({ message: 'Concert not found' });
    res.status(200).json({ message: 'Delete concert successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
