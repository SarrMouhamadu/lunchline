import { Menu } from './menu.interface';
import { User } from './user.interface';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  menuItem: {
    _id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE';
  deliveryAddress?: string;
  deliveryInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderCreateDto {
  menuId: number;
  quantity: number;
} 