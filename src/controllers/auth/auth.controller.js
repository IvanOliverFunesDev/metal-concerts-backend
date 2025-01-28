// TODO Login para users y bands
import jwt from 'jsonwebtoken';
import config from '../../config.js';
import bcrypt from 'bcryptjs';
import User from '../../models/user.model.js';
import Band from '../../models/band.model.js';
import { generateAccessToken } from '../../services/jwt.js';
import { errorResponse, successResponse } from '../../utils/responseHelper.js';

const JWT_SECRET = config.security.JWT_SECRET;

export const verifyTokenController = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: 'Authentication token is missing' });

  jwt.verify(token, JWT_SECRET, async (error, decoded) => {
    if (error) return res.status(403).json({ message: 'Authentication token is invalid or expired' });

    const { id, role } = decoded;
    let userData;

    if (role === 'user') {
      userData = await User.findById(id);
      if (!userData) return res.status(404).json({ message: 'User not found' });
    } else if (role === 'band') {
      userData = await Band.findById(id);
      if (!userData) return res.status(404).json({ message: 'Band not found' });

      // 🔹 Si la banda aún no está aprobada, denegar acceso
      if (userData.status === 'pending') {
        return res.status(403).json({ message: 'Your band is under review. Please wait for approval.' });
      }
      if (userData.status === 'rejected') {
        return res.status(403).json({ message: 'Your band application was rejected. Contact support for more info.' });
      }
    } else if (role === 'admin') {
      userData = await User.findById(id);
      if (!userData || userData.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    return res.json({
      id: userData._id,
      username: userData.username || userData.bandName,
      email: userData.email,
      role,
      status: userData.status || 'N/A'
    });
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound = await User.findOne({ email });
    let role = userFound?.role || 'user';

    if (!userFound) {
      userFound = await Band.findOne({ email });
      role = 'band';
    }
    if (!userFound) {
      return errorResponse(res, 400, 'User or Band not found');
    }

    if (role === 'band' && userFound.status !== 'approved') {
      return successResponse(res, 'Your band has not been approved by an admin yet');
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
