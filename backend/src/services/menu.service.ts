import Menu, { IMenu, IMenuItem } from '../models/menu.model';
import mongoose from 'mongoose';

// Create a new menu
export const createMenu = async (items: IMenuItem[], userId: string) => {
  const menuItems = items.map(item => ({
    ...item,
    createdBy: new mongoose.Types.ObjectId(userId)
  }));

  const menu = new Menu({ items: menuItems });
  await menu.save();
  return menu;
};

// Get all menus
export const getAllMenus = async () => {
  return await Menu.find().sort({ date: -1 });
};

// Get menu by date
export const getMenuByDate = async (date: Date) => {
  return await Menu.findOne({ date: { $gte: date, $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) } });
};

// Update menu item
export const updateMenuItem = async (menuId: string, itemId: string, updateData: Partial<IMenuItem>) => {
  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new Error('Menu not found');
  }

  const itemIndex = menu.items.findIndex(item => item._id?.toString() === itemId);

  if (itemIndex === -1) {
    throw new Error('Menu item not found');
  }

  menu.items[itemIndex] = { ...menu.items[itemIndex], ...updateData };

  await menu.save();
  return menu;
};

// Delete menu item
export const deleteMenuItem = async (menuId: string, itemId: string) => {
  const menu = await Menu.findById(menuId);

  if (!menu) {
    throw new Error('Menu not found');
  }

  menu.items = menu.items.filter(item => item._id?.toString() !== itemId);

  await menu.save();
  return menu;
};