import User from '../models/user.model.js';
import Band from '../models/band.model.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const subscribeToBand = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const band = await Band.findById(req.params.bandId);

    if (!band) return errorResponse(res, 404, 'Band not found');

    if (user.subscribedBands.includes(band._id)) {
      return errorResponse(res, 400, 'You are already subscribed to this band');
    }
    user.subscribedBands.push(band._id);
    band.subscribers.push(user.id);

    await user.save();
    await band.save();

    return successResponse(res, 'Successfully subscribed to the band');
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const unsubscribeFromBand = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    const band = await Band.findById(req.params.bandId);
    if (!band) {
      return errorResponse(res, 404, 'Band not found');
    }

    user.subscribedBands = user.subscribedBands?.filter(id => id.toString() !== band._id.toString()) || [];
    band.subscribers = band.subscribers?.filter(id => id.toString() !== user._id.toString()) || [];

    await user.save();
    await band.save();

    return successResponse(res, 'Successfully unsubscribed to the band');
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getUserSubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('subscribedBands', 'bandName image');  

    const formattedBands = user.subscribedBands.map(band => {
      return {
        id: band._id,  
        bandName: band.bandName,
        image: band.image
      };
    });

    return successResponse(res, 'User subscriptions retrieved successfully', formattedBands);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};

export const getBandSubscribers = async (req, res) => {
  try {
    const band = await Band.findById(req.user.id).populate('subscribers', 'username email');
    return successResponse(res, 'Band subscribers retrieved successfully', band.subscribers);
  } catch (error) {
    return errorResponse(res, 500, 'Internal Server Error', [{ message: error.message }]);
  }
};
