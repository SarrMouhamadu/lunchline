import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { OrderService } from './order.service';
import { MenuService } from './menu.service';
import { UserService } from './user.service';
import { Order } from './order.service';
import { Menu } from '../interfaces/menu.interface';
import { User } from '../interfaces/user.interface';

export interface DashboardStats {
  pendingOrders: number;
  todayOrders: number;
  availableMenus: number;
  totalMenus: number;
  totalTeachers: number;
  recentOrders: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private userService: UserService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      orders: this.orderService.getOrders(),
      menus: this.menuService.getMenus(),
      teachers: this.userService.getTeachers()
    }).pipe(
      map(({ orders, menus, teachers }) => {
        const today = new Date().toISOString().slice(0, 10);
        
        return {
          pendingOrders: orders.filter(order => order.status === 'pending').length,
          todayOrders: orders.filter(order => order.orderDate.startsWith(today)).length,
          availableMenus: menus.filter(menu => menu.isAvailable).length,
          totalMenus: menus.length,
          totalTeachers: teachers.length,
          recentOrders: orders
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .slice(0, 5)
        };
      })
    );
  }
} 