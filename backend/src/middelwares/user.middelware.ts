import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { _id: string, role: 'admin' | 'teacher' };
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.user = { ...user.toObject(), role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export const validateUserData = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Validate role if provided
    if (role && !['admin', 'teacher'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin or teacher' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error during validation' });
  }
};