import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/interfaces/order.interface';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Gestion des Commandes</h2>
            <p class="mt-1 text-sm text-gray-500">Gérez les commandes des utilisateurs</p>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex space-x-4">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="filterOrders()"
              placeholder="Rechercher une commande..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            [(ngModel)]="statusFilter"
            (change)="filterOrders()"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="preparing">En préparation</option>
            <option value="ready">Prête</option>
            <option value="delivered">Livrée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
      </div>

      <!-- Liste des commandes -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let order of filteredOrders">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      [src]="order.user.avatar || 'assets/images/default-avatar.png'"
                      [alt]="order.user.name"
                      class="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ order.user.name }}</div>
                    <div class="text-sm text-gray-500">{{ order.user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ order.menu.name }}</div>
                <div class="text-sm text-gray-500">{{ order.quantity }} x</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.totalPrice | currency:'EUR' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                  'bg-yellow-100 text-yellow-800': order.status === 'pending',
                  'bg-blue-100 text-blue-800': order.status === 'confirmed',
                  'bg-purple-100 text-purple-800': order.status === 'preparing',
                  'bg-green-100 text-green-800': order.status === 'ready',
                  'bg-gray-100 text-gray-800': order.status === 'delivered',
                  'bg-red-100 text-red-800': order.status === 'cancelled'
                }">
                  {{ order.status | titlecase }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.createdAt | date:'short' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-2">
                  <button
                    (click)="viewOrderDetails(order)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Détails
                  </button>
                  <button
                    *ngIf="order.status === 'pending'"
                    (click)="updateOrderStatus(order, 'confirmed')"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Confirmer
                  </button>
                  <button
                    *ngIf="order.status === 'confirmed'"
                    (click)="updateOrderStatus(order, 'preparing')"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Préparer
                  </button>
                  <button
                    *ngIf="order.status === 'preparing'"
                    (click)="updateOrderStatus(order, 'ready')"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Prêt
                  </button>
                  <button
                    *ngIf="order.status === 'ready'"
                    (click)="updateOrderStatus(order, 'delivered')"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Livrer
                  </button>
                  <button
                    *ngIf="order.status === 'pending'"
                    (click)="updateOrderStatus(order, 'cancelled')"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Annuler
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal de détails de commande -->
      <div *ngIf="selectedOrder" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">Détails de la commande #{{ selectedOrder.id }}</h3>
            <button
              (click)="closeOrderDetails()"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Fermer</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-4 space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Client</h4>
              <div class="mt-1 flex items-center">
                <img
                  [src]="selectedOrder.user.avatar || 'assets/images/default-avatar.png'"
                  [alt]="selectedOrder.user.name"
                  class="h-10 w-10 rounded-full"
                />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ selectedOrder.user.name }}</p>
                  <p class="text-sm text-gray-500">{{ selectedOrder.user.email }}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Menu commandé</h4>
              <div class="mt-1">
                <p class="text-sm text-gray-900">{{ selectedOrder.menu.name }}</p>
                <p class="text-sm text-gray-500">Quantité: {{ selectedOrder.quantity }}</p>
                <p class="text-sm text-gray-500">Prix unitaire: {{ selectedOrder.menu.price | currency:'EUR' }}</p>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Prix total</h4>
              <p class="mt-1 text-sm text-gray-900">{{ selectedOrder.totalPrice | currency:'EUR' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Statut</h4>
              <p class="mt-1">
                <span [ngClass]="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                  'bg-yellow-100 text-yellow-800': selectedOrder.status === 'pending',
                  'bg-blue-100 text-blue-800': selectedOrder.status === 'confirmed',
                  'bg-purple-100 text-purple-800': selectedOrder.status === 'preparing',
                  'bg-green-100 text-green-800': selectedOrder.status === 'ready',
                  'bg-gray-100 text-gray-800': selectedOrder.status === 'delivered',
                  'bg-red-100 text-red-800': selectedOrder.status === 'cancelled'
                }">
                  {{ selectedOrder.status | titlecase }}
                </span>
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Date de commande</h4>
              <p class="mt-1 text-sm text-gray-900">{{ selectedOrder.createdAt | date:'medium' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  searchQuery = '';
  statusFilter = 'all';
  selectedOrder: Order | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filterOrders();
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  filterOrders(): void {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = order.id.toString().includes(this.searchQuery) ||
                          order.user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          order.user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || order.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  updateOrderStatus(order: Order, newStatus: OrderStatus): void {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }
}
