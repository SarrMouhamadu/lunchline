import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Détails de la commande</h3>
        <div class="mt-5 border-t border-gray-200">
          <dl class="divide-y divide-gray-200">
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">ID de la commande</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">#{{ order._id }}</dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Statut</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
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
              </dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Date de commande</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ order.orderDate | date:'medium' }}
              </dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">ID Utilisateur</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ order.userId }}</dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Items commandés</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
                  <li *ngFor="let item of order.items" class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                    <div class="w-0 flex-1 flex items-center">
                      <span class="ml-2 flex-1 w-0 truncate">
                        {{ item.menu?.name || 'Menu supprimé' }} (x{{ item.quantity }})
                      </span>
                    </div>
                    <div class="ml-4 flex-shrink-0">
                      <span class="font-medium text-gray-900">
                        {{ item.price | currency:'EUR' }}
                      </span>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
            <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt class="text-sm font-medium text-gray-500">Total</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ order.total | currency:'EUR' }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  `
})
export class OrderDetailsComponent {
  @Input() order!: Order;
} 