import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { HttpService } from '../../../shared/services/http.service';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Gestion des Commandes</h1>
      
      <!-- Liste des commandes -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of orders">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-gray-600">{{ order.date }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ order.user.name }}</div>
                      <div class="text-sm text-gray-500">{{ order.user.phone }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <ul class="list-disc pl-4">
                    <li *ngFor="let item of order.items">
                      {{ item.name }} ({{ item.quantity }}) - {{ item.price }} FCFA
                    </li>
                  </ul>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-blue-600 font-semibold">{{ order.total }} FCFA</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="getStatusClass(order.status)"
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button (click)="updateOrderStatus(order)" class="text-indigo-600 hover:text-indigo-900">
                    Modifier statut
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class OrdersManagementComponent implements OnInit {
  orders: any[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.httpService.getOrders().subscribe(data => {
      this.orders = data;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'Préparé':
        return 'bg-green-100 text-green-800';
      case 'En livraison':
        return 'bg-blue-100 text-blue-800';
      case 'Livré':
        return 'bg-purple-100 text-purple-800';
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  }

  updateOrderStatus(order: any) {
    // TODO: Implémenter la modal pour modifier le statut
    console.log('Modifier le statut de la commande:', order);
  }
}
