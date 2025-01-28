// TODO registro banda
import Band from '../../models/band.model.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';

export const registerBandController = async (req, res) => {
  const { email, password, bandName, genre, description } = req.body;
  try {
    const bandFound = await Band.findOne({ email });
    if (bandFound) return res.status(400).json({ message: 'The email is already in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newBand = new Band({
      bandName,
      email,
      password: passwordHash,
      genre,
      description,
      status: 'pending'
    });
    const bandSaved = await newBand.save();

    return successResponse(res, 'Band registered successfully. Awaiting admin approval', {
      id: bandSaved._id,
      bandName: bandSaved.bandName,
      email: bandSaved.email,
      genre: bandSaved.genre,
      description: bandSaved.description,
      status: bandSaved.status,
      createdAt: bandSaved.createdAt,
      updatedAt: bandSaved.updatedAt
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
