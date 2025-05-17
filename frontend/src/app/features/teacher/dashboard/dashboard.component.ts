import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { MenuService } from '../../../core/services/menu.service';
import { Order, OrderStatus } from '../../../core/interfaces/order.interface';
import { Menu } from '../../../core/interfaces/menu.interface';
import { NotificationsComponent, Notification } from '../../../shared/components/notifications/notifications.component';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationsComponent, StatsCardComponent],
  template: `
    <app-notifications
      [notifications]="(notifications$ | async) || []"
      (notificationRead)="onNotificationRead($event)"
      (notificationRemoved)="onNotificationRemoved($event)"
    ></app-notifications>
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900">Tableau de bord</h2>
        <p class="mt-1 text-sm text-gray-500">Vue d'ensemble de vos commandes</p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <app-stats-card
          title="Commandes en cours"
          [value]="activeOrders"
          color="yellow"
          description="Commandes actives"
        >
          <svg icon class="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </app-stats-card>
        <app-stats-card
          title="Commandes du jour"
          [value]="todayOrders"
          color="blue"
          description="Commandes passées aujourd'hui"
        >
          <svg icon class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </app-stats-card>
        <app-stats-card
          title="Menus disponibles"
          [value]="availableMenus"
          color="green"
          description="Menus actuellement proposés"
        >
          <svg icon class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </app-stats-card>
      </div>

      <!-- Commande active -->
      <div *ngIf="currentOrder" class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Commande en cours</h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-lg font-medium text-gray-900">{{ currentOrder.menu.name }}</h4>
              <p class="mt-1 text-sm text-gray-500">
                Quantité: {{ currentOrder.quantity }}
              </p>
              <p class="mt-1 text-sm text-gray-500">
                Total: {{ currentOrder.totalPrice | currency:'XOF':'symbol-narrow':'1.0-0' }}
              </p>
            </div>
            <div class="flex items-center">
              <span [ngClass]="{
                'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full': true,
                'bg-yellow-100 text-yellow-800': currentOrder.status === 'PENDING',
                'bg-blue-100 text-blue-800': currentOrder.status === 'CONFIRMED',
                'bg-purple-100 text-purple-800': currentOrder.status === 'PREPARING',
                'bg-green-100 text-green-800': currentOrder.status === 'READY'
              }">
                {{ currentOrder.status }}
              </span>
            </div>
          </div>
          <div *ngIf="currentOrder.estimatedPickupTime" class="mt-4">
            <p class="text-sm text-gray-500">
              Temps d'attente estimé: {{ getEstimatedTime(currentOrder.estimatedPickupTime) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Historique des commandes -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Historique des commandes</h3>
        </div>
        <div class="border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let order of recentOrders">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.createdAt | date:'short' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.menu.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="{
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                      'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
                      'bg-blue-100 text-blue-800': order.status === 'CONFIRMED',
                      'bg-purple-100 text-purple-800': order.status === 'PREPARING',
                      'bg-green-100 text-green-800': order.status === 'READY',
                      'bg-gray-100 text-gray-800': order.status === 'COMPLETED',
                      'bg-red-100 text-red-800': order.status === 'CANCELLED'
                    }">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ order.totalPrice | currency:'XOF':'symbol-narrow':'1.0-0' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  activeOrders = 0;
  todayOrders = 0;
  availableMenus = 0;
  totalMenus = 0;
  currentOrder: Order | null = null;
  recentOrders: Order[] = [];
  notifications$: Observable<Notification[]>;

  constructor(
    private orderService: OrderService,
    private menuService: MenuService,
    private notificationService: NotificationService
  ) {
    this.notifications$ = this.notificationService.getNotifications();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Charger les commandes actives
    this.orderService.getUserOrders().subscribe(orders => {
      const activeStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'];
      this.activeOrders = orders.filter(order => 
        activeStatuses.includes(order.status)
      ).length;

      // Trouver la commande en cours
      this.currentOrder = orders.find(order => 
        activeStatuses.includes(order.status)
      ) || null;

      // Charger les commandes du jour
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      this.todayOrders = orders.filter(order => 
        new Date(order.createdAt) >= today
      ).length;

      // Charger l'historique des commandes
      this.recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // Exemple : notification de succès
      this.notificationService.addNotification({
        type: 'success',
        message: 'Données du tableau de bord chargées avec succès.',
        title: 'Chargement réussi'
      });
      // Exemple : alerte si commande en attente
      const pendingOrder = orders.find(order => order.status === 'PENDING');
      if (pendingOrder) {
        this.notificationService.addNotification({
          type: 'warning',
          message: `Votre commande #${pendingOrder.id} est en attente de validation !`,
          title: 'Commande en attente'
        });
      }
    });

    // Charger les menus disponibles
    this.loadMenuStats();
  }

  loadMenuStats(): void {
    this.menuService.getMenus().subscribe({
      next: (menus) => {
        this.availableMenus = menus.filter(menu => menu.isAvailable).length;
        this.totalMenus = menus.length;
      },
      error: (error) => {
        console.error('Error loading menu stats:', error);
      }
    });
  }

  getEstimatedTime(date: Date): string {
    const now = new Date();
    const diff = new Date(date).getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 0) return 'Prêt';
    if (minutes < 1) return 'Moins d\'une minute';
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  onNotificationRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id);
  }

  onNotificationRemoved(notification: Notification) {
    this.notificationService.removeNotification(notification.id);
  }
} 