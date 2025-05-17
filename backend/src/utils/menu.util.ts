import { IMenuItem } from '../models/menu.model';

// Sanitize menu item to remove sensitive information
export const sanitizeMenuItem = (menuItem: IMenuItem) => {
  const { createdBy, ...sanitizedItem } = menuItem;
  return sanitizedItem;
};

// Validate menu item price
export const validateMenuItemPrice = (price: number): boolean => {
  return price >= 0;
};

// Format menu item for response
export const formatMenuItem = (menuItem: IMenuItem) => {
  return {
    id: menuItem._id,
    name: menuItem.name,
    description: menuItem.description,
    price: menuItem.price,
    category: menuItem.category,
    isAvailable: menuItem.isAvailable
  };
};