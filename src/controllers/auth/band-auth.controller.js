// TODO registro banda
import Band from '../../models/band.model.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../../services/jwt.js';
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
      description
    });
    const bandSaved = await newBand.save();
    const token = await generateAccessToken({ id: bandSaved._id, role: 'band' });

    res.cookie('token', token);
    return successResponse(res, 'You have registered successfully', {
      id: bandSaved._id,
      bandName: bandSaved.bandName,
      email: bandSaved.email,
      genre: bandSaved.genre,
      description: bandSaved.description,
      createdAt: bandSaved.createdAt,
      updatedAt: bandSaved.updatedAt
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
