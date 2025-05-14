import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { handleAsyncError } from '../utils/user.util';

export const registerUser = handleAsyncError(async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  const user = await userService.createUser({
    username,
    email,
    password,
    firstName,
    lastName
  });

  res.status(201).json({
    message: 'User registered successfully',
    user
  });
});

export const loginUser = handleAsyncError(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  const result = await userService.loginUser(email, password);

  res.json({
    message: 'Login successful',
    ...result
  });
});

export const getUserProfile = handleAsyncError(async (req: any, res: Response) => {
  const userId = req.user._id;
  
  const user = await userService.getUserById(userId);

  res.json({
    message: 'User profile retrieved successfully',
    user
  });
});

export const updateUserProfile = handleAsyncError(async (req: any, res: Response) => {
  const userId = req.user._id;
  const updateData = req.body;
  
  const user = await userService.updateUser(userId, updateData);

  res.json({
    message: 'User profile updated successfully',
    user
  });
});

export const deleteUserProfile = handleAsyncError(async (req: any, res: Response) => {
  const userId = req.user._id;
  
  await userService.deleteUser(userId);

  res.status(200).json({
    message: 'User profile deleted successfully'
  });
});