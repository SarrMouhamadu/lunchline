import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private menuItems = new BehaviorSubject<any[]>([]);
  private cartItems = new BehaviorSubject<any[]>([]);
  private orders = new BehaviorSubject<any[]>([]);

  constructor() {
    // Initialisation avec des données de test
    this.initializeTestData();
  }

  private initializeTestData() {
    const testMenu = [
      {
        id: 1,
        name: 'Poulet Yassa',
        price: 4500,
        category: 'Plats',
        description: 'Poulet préparé à la manière traditionnelle sénégalaise',
        image: 'poulet-yassa.jpg'
      },
      {
        id: 2,
        name: 'Thiéboudienne',
        price: 5000,
        category: 'Plats',
        description: 'Riz au poisson et légumes',
        image: 'thieboudienne.jpg'
      }
    ];

    this.menuItems.next(testMenu);
  }

  // Menu
  getMenuItems(): Observable<any[]> {
    return this.menuItems.asObservable();
  }

  addMenuItem(item: any): void {
    const currentItems = this.menuItems.value;
    currentItems.push(item);
    this.menuItems.next(currentItems);
  }

  updateMenuItem(id: number, item: any): void {
    const currentItems = this.menuItems.value;
    const index = currentItems.findIndex(i => i.id === id);
    if (index !== -1) {
      currentItems[index] = item;
      this.menuItems.next(currentItems);
    }
  }

  deleteMenuItem(id: number): void {
    const currentItems = this.menuItems.value;
    const filteredItems = currentItems.filter(item => item.id !== id);
    this.menuItems.next(filteredItems);
  }

  // Cart
  getCartItems(): Observable<any[]> {
    return this.cartItems.asObservable();
  }

  addToCart(item: any): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...item, quantity: 1 });
    }
    this.cartItems.next(currentCart);
  }

  removeFromCart(id: number): void {
    const currentCart = this.cartItems.value;
    const filteredCart = currentCart.filter(item => item.id !== id);
    this.cartItems.next(filteredCart);
  }

  // Orders
  getOrders(): Observable<any[]> {
    return this.orders.asObservable();
  }

  placeOrder(order: any): void {
    const currentOrders = this.orders.value;
    currentOrders.push(order);
    this.orders.next(currentOrders);
  }
}
