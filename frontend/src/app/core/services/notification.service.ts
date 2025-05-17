import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor() {
    // Charger les notifications non lues depuis le stockage local
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      this.notifications.next(JSON.parse(savedNotifications));
    }
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([newNotification, ...currentNotifications]);
    this.saveToLocalStorage();
  }

  markAsRead(notificationId: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    this.notifications.next(updatedNotifications);
    this.saveToLocalStorage();
  }

  removeNotification(notificationId: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );
    this.notifications.next(updatedNotifications);
    this.saveToLocalStorage();
  }

  clearAllNotifications(): void {
    this.notifications.next([]);
    this.saveToLocalStorage();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('notifications', JSON.stringify(this.notifications.value));
  }

  show(notification: Omit<Notification, 'id'>): void {
    const id = Math.random().toString(36).substring(2);
    const newNotification = { ...notification, id };
    const currentNotifications = this.notifications.value;
    
    this.notifications.next([...currentNotifications, newNotification]);

    if (notification.duration !== 0) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration || 5000);
    }
  }

  success(message: string, duration?: number): void {
    this.show({ type: 'success', message, duration });
  }

  error(message: string, duration?: number): void {
    this.show({ type: 'error', message, duration });
  }

  info(message: string, duration?: number): void {
    this.show({ type: 'info', message, duration });
  }

  warning(message: string, duration?: number): void {
    this.show({ type: 'warning', message, duration });
  }

  remove(id: string): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(currentNotifications.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications.next([]);
  }
} 