import Band from '../../models/band.model.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';

export const approveBandController = async (req, res) => {
  try {
    const { id } = req.params;
    const band = await Band.findById(id);

    if (!band) return errorResponse(res, 404, 'Band not found');
    if (band.status !== 'pending') return errorResponse(res, 400, 'Band is already approved or rejected');

    band.status = 'approved';
    await band.save();

    return successResponse(res, 200, 'Band has been approved successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const rejectBandController = async (req, res) => {
  try {
    const { id } = req.params;
    const band = await Band.findById(id);

    if (!band) return errorResponse(res, 404, 'Band not found');
    if (band.status !== 'pending') return errorResponse(res, 400, 'Band is already approved or rejected');

    band.status = 'rejected';
    await band.save();

    return successResponse(res, 200, 'Band has been rejected successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
