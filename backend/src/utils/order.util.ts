import { IOrder, IOrderItem } from '../models/order.model';

// Sanitize order to remove sensitive information
export const sanitizeOrder = (order: IOrder) => {
  const { userId, ...sanitizedOrder } = order.toObject();
  return sanitizedOrder;
};

// Format order item for response
export const formatOrderItem = (orderItem: IOrderItem) => {
  return {
    menuItemId: orderItem.menuItemId,
    name: orderItem.name,
    price: orderItem.price,
    quantity: orderItem.quantity
  };
};

// Calculate total order price
export const calculateOrderTotal = (items: IOrderItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};