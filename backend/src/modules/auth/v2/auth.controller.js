import authService from '../auth.service.js';

export const login = async (req, res) => {
  const data = await authService.login({ ...req.body, apiVersion: 'v2' });
  res.status(200).json(data);
};
