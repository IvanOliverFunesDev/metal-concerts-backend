import Band from '../models/band.model.js';
import { errorResponse } from '../utils/responseHelper.js';

export const checkTargetBandStatus = async (req, res, next) => {
  try {
    const band = await Band.findById(req.params.bandId);
    if (!band) return errorResponse(res, 404, 'Band not found');
    if (band.status !== 'approved') return errorResponse(res, 403, 'You cannot subscribe to a band that is not approved');
    next();
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
