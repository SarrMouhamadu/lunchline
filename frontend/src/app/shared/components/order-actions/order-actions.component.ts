import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrderStatus } from '../../../core/services/order.service';

@Component({
  selector: 'app-order-actions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex space-x-3">
      <!-- Confirmer -->
      <button
        *ngIf="order.status === 'pending'"
        (click)="onAction('confirmed')"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Confirmer
      </button>

      <!-- Préparer -->
      <button
        *ngIf="order.status === 'confirmed'"
        (click)="onAction('preparing')"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        Préparer
      </button>

      <!-- Prêt -->
      <button
        *ngIf="order.status === 'preparing'"
        (click)="onAction('ready')"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Marquer comme prêt
      </button>

      <!-- Terminer -->
      <button
        *ngIf="order.status === 'ready'"
        (click)="onAction('completed')"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Terminer
      </button>

      <!-- Annuler -->
      <button
        *ngIf="['pending', 'confirmed', 'preparing'].includes(order.status)"
        (click)="onAction('cancelled')"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Annuler
      </button>
    </div>
  `
})
export class OrderActionsComponent {
  @Input() order!: Order;
  @Output() action = new EventEmitter<OrderStatus>();

  onAction(status: OrderStatus) {
    this.action.emit(status);
  }
} 