// TODO registro usuario
import User from '../../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../../services/jwt.js';

export const registerController = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) return res.status(400).json({ message: 'The email is already in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash
    });
    const userSaved = await newUser.save();
    const token = await generateAccessToken({ id: userSaved._id, role: 'user' });

    res.cookie('token', token);
    res.status(201).json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
