import Order, { IOrder, IOrderItem, OrderStatus } from '../models/order.model';
import Menu from '../models/menu.model';
import mongoose from 'mongoose';

// Create a new order
export const createOrder = async (userId: string, items: IOrderItem[]) => {
  // Calculate total price
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  const order = new Order({
    userId: new mongoose.Types.ObjectId(userId),
    items,
    totalPrice,
    status: 'pending'
  });

  await order.save();
  return order;
};

// Get all orders (admin) or user's orders (teacher)
export const getOrders = async (userId: string, userRole: 'admin' | 'teacher') => {
  if (userRole === 'admin') {
    return await Order.find().sort({ orderDate: -1 });
  } else {
    return await Order.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ orderDate: -1 });
  }
};

// Get a specific order by ID
export const getOrderById = async (orderId: string, userId: string, userRole: 'admin' | 'teacher') => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Admin can see any order, teacher can only see their own
  if (userRole === 'teacher' && order.userId.toString() !== userId) {
    throw new Error('Not authorized to view this order');
  }

  return order;
};

// Update order status (admin only)
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();

  return order;
};

// Cancel an order
export const cancelOrder = async (orderId: string, userId: string, userRole: 'admin' | 'teacher') => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  // Admin can cancel any order, teacher can only cancel their own
  if (userRole === 'teacher' && order.userId.toString() !== userId) {
    throw new Error('Not authorized to cancel this order');
  }

  // Only pending orders can be cancelled
  if (order.status !== 'pending') {
    throw new Error('Only pending orders can be cancelled');
  }

  order.status = 'cancelled';
  await order.save();

  return order;
};