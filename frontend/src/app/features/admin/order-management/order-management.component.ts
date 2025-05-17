import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/interfaces/order.interface';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900">Gestion des commandes</h2>
        <p class="mt-1 text-sm text-gray-500">Suivez et gérez les commandes en cours</p>
      </div>

      <!-- Filtres -->
      <div class="bg-white shadow rounded-lg p-4">
        <div class="flex flex-wrap gap-4">
          <button
            *ngFor="let status of orderStatuses"
            (click)="filterByStatus(status)"
            [ngClass]="{
              'px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2': true,
              'bg-indigo-100 text-indigo-800 hover:bg-indigo-200 focus:ring-indigo-500': selectedStatus === status,
              'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500': selectedStatus !== status
            }"
          >
            {{ status }}
          </button>
        </div>
      </div>

      <!-- Liste des commandes -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Commandes</h3>
        </div>
        <div class="border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professeur</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantité</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let order of filteredOrders">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ order.id }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.user?.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.menu?.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.quantity }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ order.totalPrice | currency:'XOF':'symbol-narrow':'1.0-0' }}
                  </td>
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ order.createdAt | date:'short' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        *ngIf="canUpdateStatus(order.status)"
                        (click)="updateOrderStatus(order)"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Mettre à jour
                      </button>
                      <button
                        *ngIf="order.status === 'PENDING'"
                        (click)="cancelOrder(order)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Annuler
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal de mise à jour du statut -->
      <div *ngIf="showStatusModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Mettre à jour le statut de la commande
                  </h3>
                  <div class="mt-4">
                    <div class="grid grid-cols-2 gap-4">
                      <button
                        *ngFor="let status of getNextStatuses(selectedOrder?.status)"
                        (click)="confirmStatusUpdate(status)"
                        class="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {{ status }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                (click)="closeStatusModal()"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: OrderStatus | 'ALL' = 'ALL';
  showStatusModal = false;
  selectedOrder: Order | null = null;
  orderStatuses: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getAllOrders().subscribe(orders => {
      this.orders = orders;
      this.filterOrders();
    });
  }

  filterByStatus(status: OrderStatus | 'ALL'): void {
    this.selectedStatus = status;
    this.filterOrders();
  }

  private filterOrders(): void {
    this.filteredOrders = this.selectedStatus === 'ALL'
      ? this.orders
      : this.orders.filter(order => order.status === this.selectedStatus);
  }

  canUpdateStatus(status: OrderStatus): boolean {
    return ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'].includes(status);
  }

  getNextStatuses(currentStatus: OrderStatus | undefined): OrderStatus[] {
    if (!currentStatus) return [];
    
    switch (currentStatus) {
      case 'PENDING':
        return ['CONFIRMED', 'CANCELLED'];
      case 'CONFIRMED':
        return ['PREPARING'];
      case 'PREPARING':
        return ['READY'];
      case 'READY':
        return ['COMPLETED'];
      default:
        return [];
    }
  }

  updateOrderStatus(order: Order): void {
    this.selectedOrder = order;
    this.showStatusModal = true;
  }

  confirmStatusUpdate(status: OrderStatus): void {
    if (this.selectedOrder) {
      this.orderService.updateOrderStatus(this.selectedOrder.id, status).subscribe(() => {
        this.loadOrders();
        this.closeStatusModal();
      });
    }
  }

  cancelOrder(order: Order): void {
    if (confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      this.orderService.cancelOrder(order.id).subscribe(() => {
        this.loadOrders();
      });
    }
  }

  closeStatusModal(): void {
    this.showStatusModal = false;
    this.selectedOrder = null;
  }
} 