import { Request, Response } from 'express';
import * as menuService from '../services/menu.service';
import { handleAsyncError } from '../utils/user.util';

// Create a new menu
export const createMenu = handleAsyncError(async (req: any, res: Response) => {
  const { items } = req.body;
  const userId = req.user._id;

  const menu = await menuService.createMenu(items, userId);

  res.status(201).json({
    message: 'Menu created successfully',
    menu
  });
});

// Get all menus
export const getAllMenus = handleAsyncError(async (req: Request, res: Response) => {
  const menus = await menuService.getAllMenus();

  res.json({
    message: 'Menus retrieved successfully',
    menus
  });
});

// Get menu by date
export const getMenuByDate = handleAsyncError(async (req: Request, res: Response) => {
  const { date } = req.params;
  const menu = await menuService.getMenuByDate(new Date(date));

  if (!menu) {
    return res.status(404).json({
      message: 'No menu found for the specified date'
    });
  }

  res.json({
    message: 'Menu retrieved successfully',
    menu
  });
});

// Update menu item
export const updateMenuItem = handleAsyncError(async (req: any, res: Response) => {
  const { menuId, itemId } = req.params;
  const updateData = req.body;

  const menu = await menuService.updateMenuItem(menuId, itemId, updateData);

  res.json({
    message: 'Menu item updated successfully',
    menu
  });
});

// Delete menu item
export const deleteMenuItem = handleAsyncError(async (req: any, res: Response) => {
  const { menuId, itemId } = req.params;

  const menu = await menuService.deleteMenuItem(menuId, itemId);

  res.json({
    message: 'Menu item deleted successfully',
    menu
  });
});