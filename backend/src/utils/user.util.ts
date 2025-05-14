import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator/lib/validation-result';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const handleAsyncError = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const sanitizeUserResponse = (user: any) => {
  const { password, role, ...userWithoutPassword } = user.toObject();
  return { ...userWithoutPassword, role };
};