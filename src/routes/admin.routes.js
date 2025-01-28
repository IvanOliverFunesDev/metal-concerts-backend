import { Router } from 'express';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { checkAdmin } from '../middleware/check-admin.middleware.js';
import { approveBandController, rejectBandController } from '../controllers/admin/band-approval.controller.js';
import User from '../models/user.model.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.patch('/bands/:id/approve', authRequired, checkAdmin, approveBandController);
router.patch('/bands/:id/reject', authRequired, checkAdmin, rejectBandController);
router.post('/create-admin', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return errorResponse(res, 400, 'Admin already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      username,
      email,
      password: passwordHash,
      role: 'admin'
    });

    await newAdmin.save();
    return successResponse(res, 'Admin created successfully', { email: newAdmin.email, role: newAdmin.role });
  } catch (error) {
    return errorResponse(res, 500, 'Error creating admin', [{ message: error.message }]);
  }
});

export default router;
