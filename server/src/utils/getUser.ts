import { Request } from 'express';
import { User } from '../models/user.js';
import { ValidationError } from './errors.js';

export const getUser = async (req: Request) => {
  const userId = req.session.user?._id || req.body.userId;
  if (!userId) {
    throw new ValidationError('User ID is required');
  }

  const user = await User.findById(userId);
  if (!user) throw new ValidationError('User not found');
  return user;
};
