// TODO Login para users y bands
import User from '../../models/user.model.js';
import Band from '../../models/band.model.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../../services/jwt.js';
import { errorResponse, successResponse } from '../../utils/responseHelper.js';

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound = await User.findOne({ email });
    let role = 'user';

    if (!userFound) {
      userFound = await Band.findOne({ email });
      role = 'band';
    }
    if (!userFound) {
      return errorResponse(res, 400, 'User or Band not found');
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(404).json({ meesage: 'Incorrect Password' });

    const token = await generateAccessToken({ id: userFound._id, role });

    res.cookie('token', token);

    return successResponse(res, 'login succesfully', {
      id: userFound._id,
      role,
      username: userFound.username || userFound.bandName,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updateAt: userFound.updateAt
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const logoutController = (req, res) => {
  res.cookie('token', '', {
    expires: new Date(0)
  });
  return successResponse(res, 'logout completed');
};
