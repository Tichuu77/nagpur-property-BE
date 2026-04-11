import  AdminService from '../admin.service.js';
import { successResponse } from '../../../utils/api-response.js';

export const getProfile = async (req, res, next) => {
  try {
    const data = await  AdminService.getProfile(req.user.id);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = await  AdminService.updateProfile(req.user.id, req.body, req.file);
    res.status(200).json(successResponse(data, 'Profile updated'));
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = await  AdminService.login(req.body);
    res.status(200).json(successResponse(data,'Login successful'));
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const data = await  AdminService.forgotPassword(req.body.email);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const data = await  AdminService.updatePassword(req.user.id, req.body.oldPassword, req.body.newPassword);
    res.status(200).json(successResponse(data, 'Password updated'));
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const data = await  AdminService.resetPassword(req.body.email, req.body.otp, req.body.newPassword);
    res.status(200).json(successResponse(data));
  } catch (err) {
    next(err);
  }
};

