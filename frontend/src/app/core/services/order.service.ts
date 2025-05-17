import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(orderData: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  updateOrderStatus(id: string, status: Order['status']): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }

  updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/payment`, { paymentStatus });
  }

  cancelOrder(id: string): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user`);
  }

  getOrderHistory(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/history`);
  }
} 