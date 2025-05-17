import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Mes Commandes</h1>
      
      <!-- Liste des commandes -->
      <div *ngIf="orders.length > 0" class="bg-white rounded-lg shadow-md p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Articles</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let order of orders">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-gray-600">{{ order.date }}</span>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Aucune commande -->
      <div *ngIf="orders.length === 0" class="text-center py-8">
        <p class="text-gray-600">Aucune commande pour le moment</p>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
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
      case 'Annulé':
        return 'bg-red-100 text-red-800';
      case 'Terminé':
        return 'bg-blue-100 text-blue-800';
      default:
        return '';
    }
  }
}
