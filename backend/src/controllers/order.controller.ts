import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { handleAsyncError } from '../utils/user.util';

// Create a new order
export const createOrder = handleAsyncError(async (req: any, res: Response) => {
  const { items } = req.body;
  const userId = req.user._id;

  const order = await orderService.createOrder(userId, items);

  res.status(201).json({
    message: 'Order created successfully',
    order
  });
});

// Get all orders
export const getOrders = handleAsyncError(async (req: any, res: Response) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  const orders = await orderService.getOrders(userId, userRole);

  res.json({
    message: 'Orders retrieved successfully',
    orders
  });
});

// Get a specific order by ID
export const getOrderById = handleAsyncError(async (req: any, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const order = await orderService.getOrderById(orderId, userId, userRole);

  res.json({
    message: 'Order retrieved successfully',
    order
  });
});

// Update order status (admin only)
export const updateOrderStatus = handleAsyncError(async (req: any, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await orderService.updateOrderStatus(orderId, status);

  res.json({
    message: 'Order status updated successfully',
    order
  });
});

// Cancel an order
export const cancelOrder = handleAsyncError(async (req: any, res: Response) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const order = await orderService.cancelOrder(orderId, userId, userRole);

  res.json({
    message: 'Order cancelled successfully',
    order
  });
});