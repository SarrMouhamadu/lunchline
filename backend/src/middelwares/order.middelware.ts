import { Request, Response, NextFunction } from 'express';
import Menu from '../models/menu.model';

// Middleware to validate order creation
export const validateOrderCreation = async (req: Request, res: Response, next: NextFunction) => {
  const { items } = req.body;

  // Check if items array is provided and not empty
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' });
  }

  const errors: string[] = [];

  // Validate each order item
  for (const item of items) {
    if (!item.menuItemId) {
      errors.push('Each order item must have a menu item ID');
    }

    if (!item.quantity || item.quantity < 1) {
      errors.push('Order item quantity must be at least 1');
    }

    // Validate menu item exists and is available
    try {
      const menuItem = await Menu.findOne({ 'items._id': item.menuItemId });
      if (!menuItem) {
        errors.push(`Menu item with ID ${item.menuItemId} does not exist`);
      }
    } catch (error) {
      errors.push('Error validating menu item');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

// Middleware to check if user can modify order
export const canModifyOrder = (req: any, res: Response, next: NextFunction) => {
  // Admin can modify any order
  if (req.user.role === 'admin') {
    return next();
  }

  // Teachers can only modify their own orders
  if (req.user.role === 'teacher') {
    const orderId = req.params.orderId;
    
    // In the order service, we'll add a check to ensure the order belongs to the current user
    req.canModifyOrder = true;
    return next();
  }

  return res.status(403).json({
    error: 'You do not have permission to modify this order'
  });
};