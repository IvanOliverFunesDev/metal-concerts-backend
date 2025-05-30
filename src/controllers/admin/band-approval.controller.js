import Band from '../../models/band.model.js';
import { successResponse, errorResponse } from '../../utils/responseHelper.js';
import { sendApprovalEmail, sendRejectionEmail } from '../../services/email.service.js';

export const approveBandController = async (req, res) => {
  try {
    const { id } = req.params;
    const band = await Band.findById(id);

    if (!band) return errorResponse(res, 404, 'Band not found');
    if (band.status !== 'pending') return errorResponse(res, 400, 'Band is already approved or rejected');

    band.status = 'approved';
    await band.save();
    await sendApprovalEmail(band.email, band.bandName);

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

    band.status = 'reject';
    await band.save();
    await sendRejectionEmail(band.email, band.bandName);

    return successResponse(res, 200, 'Band has been rejected successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const getBandByStatusApproved = async (req, res) => {
  try {
    const filter = { status: 'pending' };
    const bands = await Band.find(filter).select('bandName email description genre status');
    if (!bands) return successResponse(res, 'Band not found');
    return successResponse(res, 'Get band succesfully', {
      bands
    });
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
