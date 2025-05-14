import express, { RequestHandler } from 'express';
import * as menuController from '../controllers/menu.controller';
import { authenticateUser } from '../middelwares/user.middelware';
import { isAdmin, validateMenuItem } from '../middelwares/menu.middelware';

const router = express.Router();

// Get all menus (both admin and teacher)
router.get('/', 
  authenticateUser as RequestHandler, 
  menuController.getAllMenus as RequestHandler
);

// Get menu by date (both admin and teacher)
router.get('/date/:date', 
  authenticateUser as RequestHandler, 
  menuController.getMenuByDate as RequestHandler
);

// Create a new menu (admin only)
router.post('/', 
  authenticateUser as RequestHandler,
  isAdmin as RequestHandler,
  validateMenuItem as RequestHandler,
  menuController.createMenu as RequestHandler
);

// Update a menu item (admin only)
router.patch('/:menuId/items/:itemId', 
  authenticateUser as RequestHandler,
  isAdmin as RequestHandler,
  validateMenuItem as RequestHandler,
  menuController.updateMenuItem as RequestHandler
);

// Delete a menu item (admin only)
router.delete('/:menuId/items/:itemId', 
  authenticateUser as RequestHandler,
  isAdmin as RequestHandler,
  menuController.deleteMenuItem as RequestHandler
);

export default router;