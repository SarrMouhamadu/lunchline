import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuItem } from '../interfaces/menu-item.interface';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems.next(JSON.parse(savedCart));
    }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addToCart(menuItem: MenuItem, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.menuItem._id === menuItem._id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.saveCart([...currentItems]);
    } else {
      this.saveCart([...currentItems, { menuItem, quantity }]);
    }
  }

  removeFromCart(menuItemId: string): void {
    const currentItems = this.cartItems.value;
    this.saveCart(currentItems.filter(item => item.menuItem._id !== menuItemId));
  }

  updateQuantity(menuItemId: string, quantity: number): void {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.menuItem._id === menuItemId);
    
    if (item) {
      item.quantity = quantity;
      this.saveCart([...currentItems]);
    }
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => {
      return total + (item.menuItem.price * item.quantity);
    }, 0);
  }

  getCartItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }
} 