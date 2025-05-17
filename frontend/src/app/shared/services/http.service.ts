import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Menu
  getMenus(): Observable<any> {
    return this.http.get(`${this.apiUrl}/menus`);
  }

  getMenu(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/menus/${id}`);
  }

  addMenu(menu: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/menus`, menu);
  }

  updateMenu(id: string, menu: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/menus/${id}`, menu);
  }

  deleteMenu(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/menus/${id}`);
  }

  // Orders
  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  getOrder(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${id}`);
  }

  addOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  updateOrder(id: string, order: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/${id}`, order);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${id}`);
  }

  // Cart
  getCartItems(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart`);
  }

  updateCartItem(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/cart/${item.id}`, item);
  }

  removeFromCart(itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cart/${itemId}`);
  }

  placeOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, order);
  }

  addToCart(item: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/cart`, item);
  }

  // Users
  getUser(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, user);
  }
}
