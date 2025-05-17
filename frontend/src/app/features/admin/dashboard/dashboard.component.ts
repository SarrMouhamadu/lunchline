import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MenuService } from '../../../core/services/menu.service';
import { UserService } from '../../../core/services/user.service';
import { Order, OrderStatus } from '../../../core/services/order.service';
import { Menu } from '../../../core/interfaces/menu.interface';
import { User } from '../../../core/interfaces/user.interface';
import { NotificationsComponent, Notification } from '../../../shared/components/notifications/notifications.component';
import { NotificationService } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';
import { StatsCardComponent } from '../../../shared/components/stats-card/stats-card.component';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NotificationsComponent, StatsCardComponent],
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
        <p class="mt-1 text-sm text-gray-500">Vue d'ensemble de l'activité</p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <app-stats-card
          title="Commandes en attente"
          [value]="stats?.pendingOrders || 0"
          color="yellow"
          description="Commandes à traiter"
        >
          <svg icon class="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </app-stats-card>
        <app-stats-card
          title="Commandes du jour"
          [value]="stats?.todayOrders || 0"
          color="blue"
          description="Commandes passées aujourd'hui"
        >
          <svg icon class="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </app-stats-card>
        <app-stats-card
          title="Menus disponibles"
          [value]="stats?.availableMenus || 0"
          color="green"
          description="Menus actuellement proposés"
        >
          <svg icon class="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </app-stats-card>
        <app-stats-card
          title="Professeurs inscrits"
          [value]="stats?.totalTeachers || 0"
          color="purple"
          description="Utilisateurs enseignants enregistrés"
        >
          <svg icon class="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </app-stats-card>
      </div>

      <!-- Dernières commandes -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Dernières commandes</h3>
        </div>
        <div class="border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professeur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let order of stats?.recentOrders || []">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ order._id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.userId }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ order.items[0]?.menu?.name || 'Menu supprimé' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="{
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                      'bg-yellow-100 text-yellow-800': order.status === 'pending',
                      'bg-blue-100 text-blue-800': order.status === 'confirmed',
                      'bg-purple-100 text-purple-800': order.status === 'preparing',
                      'bg-green-100 text-green-800': order.status === 'ready',
                      'bg-gray-100 text-gray-800': order.status === 'completed',
                      'bg-red-100 text-red-800': order.status === 'cancelled'
                    }">
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.orderDate | date:'short' }}
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
  stats: DashboardStats | null = null;
  notifications$: Observable<Notification[]>;

  constructor(
    private dashboardService: DashboardService,
    private notificationService: NotificationService
  ) {
    this.notifications$ = this.notificationService.getNotifications();
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  onNotificationRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id);
  }

  onNotificationRemoved(notification: Notification) {
    this.notificationService.removeNotification(notification.id);
  }
} 