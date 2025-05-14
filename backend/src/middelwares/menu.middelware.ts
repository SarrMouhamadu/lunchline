import { Request, Response, NextFunction } from 'express';

// Middleware to check if user is admin for menu creation
export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied. Only admins can perform this action.'
    });
  }
  next();
};

// Middleware to validate menu item creation
export const validateMenuItem = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, category } = req.body;

  const errors: string[] = [];

  if (!name || name.trim() === '') {
    errors.push('Menu item name is required');
  }

  if (!price || price < 0) {
    errors.push('Valid price is required');
  }

  if (!category || category.trim() === '') {
    errors.push('Menu item category is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};