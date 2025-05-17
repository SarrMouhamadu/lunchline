import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem } from '../interfaces/menu-item.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl);
  }

  getMenuItem(id: string): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/${id}`);
  }

  createMenuItem(menuItem: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.post<MenuItem>(this.apiUrl, menuItem);
  }

  updateMenuItem(id: string, menuItem: Partial<MenuItem>): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.apiUrl}/${id}`, menuItem);
  }

  deleteMenuItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateMenuItemAvailability(id: string, available: boolean): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/${id}/availability`, { available });
  }

  updateMenuItemPrice(id: string, price: number): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/${id}/price`, { price });
  }

  updateMenuItemImage(id: string, image: File): Observable<MenuItem> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.patch<MenuItem>(`${this.apiUrl}/${id}/image`, formData);
  }
} 