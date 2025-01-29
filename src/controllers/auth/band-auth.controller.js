// TODO registro banda
import Band from '../../models/band.model.js';
import User from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';

export const registerBandController = async (req, res) => {
  const { email, password, bandName, genre, description } = req.body;
  try {
    const bandFound = await Band.findOne({ email });
    if (bandFound) return errorResponse(res, 400, 'The email is already in use');

    const userFound = await User.findOne({ email });
    if (userFound) return errorResponse(res, 400, 'The email is already in use by a user');

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
