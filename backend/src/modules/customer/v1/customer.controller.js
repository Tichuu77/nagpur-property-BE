import customerService from '../customer.service.js';
import { successResponse } from '../../../utils/api-response.js';

export const getProfile = async (req, res, next) => {
  try {
    const data = await customerService.getProfile(req.user.id);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await customerService.updateProfile(req.user.id, req.body, req.file);
    res.status(200).json(successResponse(data, 'Profile updated'));
  } catch (err) {
    next(err);
  }
};

export const updateFcmToken = async (req, res, next) => {
  try {
    await customerService.updateFcmToken(req.user.id, req.body.fcmToken);
    res.status(200).json(successResponse(null, 'FCM token updated'));
  } catch (err) {
    next(err);
  }
};