import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { sanitizeUserResponse } from '../utils/user.util';

export const createUser = async (userData: Partial<IUser>) => {
  // Ensure role is set, default to 'teacher' if not specified
  const userDataWithRole = {
    ...userData,
    role: userData.role || 'teacher'
  };
  const user = new User(userDataWithRole);
  await user.save();
  return sanitizeUserResponse(user);
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  
  if (!user) {
    throw new Error('Invalid login credentials');
  }

  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Invalid login credentials');
  }

  const userId = user._id instanceof mongoose.Types.ObjectId 
    ? user._id.toString() 
    : typeof user._id === 'string' 
      ? user._id 
      : String(user._id);

  const token = jwt.sign(
    { _id: userId, role: user.role }, 
    process.env.JWT_SECRET || 'your_jwt_secret', 
    { expiresIn: '7d' }
  );

  return {
    user: sanitizeUserResponse(user),
    token
  };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUserResponse(user);
};

export const updateUser = async (userId: string, updateData: Partial<IUser>) => {
  const user = await User.findByIdAndUpdate(
    userId, 
    updateData, 
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUserResponse(user);
};

export const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return sanitizeUserResponse(user);
};