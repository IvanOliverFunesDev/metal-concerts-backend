import User from '../../models/user.model.js';
import Band from '../../models/band.model.js';

import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../../services/jwt.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';

export const registerUserController = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json({ message: 'The email is already in use' });

    const bandFound = await Band.findOne({ email });
    if (bandFound) return res.status(400).json({ message: 'The email is already in use' });

    const nameFound = await User.findOne({ username });
    if (nameFound) return errorResponse(res, 400, 'The username is already in use');

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash
    });
    const userSaved = await newUser.save();
    const token = await generateAccessToken({ id: userSaved._id, role: 'user' });

    return successResponse(res, 'You have registered successfully', {
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
      // eslint-disable-next-line object-shorthand
      token: token
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
