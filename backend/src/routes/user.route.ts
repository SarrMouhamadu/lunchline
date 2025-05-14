import express, { RequestHandler } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateUser, validateUserData } from '../middelwares/user.middelware';

const router = express.Router();

// Create a new user
router.post('/register', 
  validateUserData as RequestHandler, 
  userController.registerUser as RequestHandler
);

// User login
router.post('/login', userController.loginUser as RequestHandler);

// Get user profile
router.get('/me', 
  authenticateUser as RequestHandler, 
  userController.getUserProfile as RequestHandler
);

// Update user profile
router.patch('/me', 
  authenticateUser as RequestHandler, 
  userController.updateUserProfile as RequestHandler
);

// Delete user profile
router.delete('/me', 
  authenticateUser as RequestHandler, 
  userController.deleteUserProfile as RequestHandler
);

export default router;