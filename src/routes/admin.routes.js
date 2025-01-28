import { Router } from 'express';
import { authRequired } from '../middleware/validate-token.middleware.js';
import { approveBandController, getBandByStatusApproved, rejectBandController } from '../controllers/admin/band-approval.controller.js';
import User from '../models/user.model.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import bcrypt from 'bcryptjs';
import { checkUserRole } from '../middleware/check-role.middleware.js';

const router = Router();
router.get('/bands/pending', authRequired, checkUserRole('admin'), getBandByStatusApproved);
router.patch('/bands/:id/approved', authRequired, checkUserRole('admin'), approveBandController);
router.patch('/bands/:id/reject', authRequired, checkUserRole('admin'), rejectBandController);
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
