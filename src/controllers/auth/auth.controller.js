// // TODO Login para users y bands
// import User from '../../models/user.model.js';
// import Band from '../../models/band.model.js';
// import bcrypt from 'bcryptjs';
// import { generateAccessToken } from '../../services/jwt.js';

// export const loginController = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     let userFound = await User.findOne({ email });
//     let role = 'user';

//     if (!userFound) {
//       userFound = await Band.findOne({ email });
//       role = 'band';
//     }
//     if (!userFound) {
//       return res.status(400).json({ message: 'User or Band not found' });
//     }

//     const isMatch = await bcrypt.compare(password, userFound.password);
//     if (!isMatch) return res.status(404).json({ meesage: 'Incorrect Password' });

//     const token = await generateAccessToken({ id: userFound._id, role });

//     res.cookie('token', token);

//     res.json({
//       id: userFound._id,
//       role,
//       username: userFound.username || userFound.bandName,
//       email: userFound.email,
//       createdAt: userFound.createdAt,
//       updateAt: userFound.updateAt
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
