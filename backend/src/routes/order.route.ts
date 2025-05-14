import express, { RequestHandler } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticateUser } from '../middelwares/user.middelware';
import { validateOrderCreation, canModifyOrder } from '../middelwares/order.middelware';

const router = express.Router();

// Create a new order (teachers only)
router.post('/', 
  authenticateUser as RequestHandler,
  validateOrderCreation as RequestHandler,
  orderController.createOrder as RequestHandler
);

// Get all orders (admin sees all, teachers see their own)
router.get('/', 
  authenticateUser as RequestHandler, 
  orderController.getOrders as RequestHandler
);

// Get a specific order by ID
router.get('/:orderId', 
  authenticateUser as RequestHandler, 
  orderController.getOrderById as RequestHandler
);

// Update order status (admin only)
router.patch('/:orderId/status', 
  authenticateUser as RequestHandler,
  canModifyOrder as RequestHandler,
  orderController.updateOrderStatus as RequestHandler
);

// Cancel an order
router.delete('/:orderId', 
  authenticateUser as RequestHandler,
  canModifyOrder as RequestHandler,
  orderController.cancelOrder as RequestHandler
);

export default router;