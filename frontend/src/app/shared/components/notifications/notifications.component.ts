import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  timestamp: Date;
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 w-96 space-y-4">
      <div
        *ngFor="let notification of notifications"
        [@notificationAnimation]
        class="bg-white rounded-lg shadow-lg overflow-hidden"
        [ngClass]="{
          'border-l-4': true,
          'border-blue-500': notification.type === 'info',
          'border-green-500': notification.type === 'success',
          'border-yellow-500': notification.type === 'warning',
          'border-red-500': notification.type === 'error'
        }"
      >
        <div class="p-4">
          <div class="flex items-start">
            <!-- Icône -->
            <div class="flex-shrink-0">
              <svg
                *ngIf="notification.type === 'info'"
                class="h-6 w-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg
                *ngIf="notification.type === 'success'"
                class="h-6 w-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg
                *ngIf="notification.type === 'warning'"
                class="h-6 w-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <svg
                *ngIf="notification.type === 'error'"
                class="h-6 w-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <!-- Contenu -->
            <div class="ml-3 w-0 flex-1">
              <p *ngIf="notification.title" class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-500">
                {{ notification.message }}
              </p>
              <p class="mt-1 text-xs text-gray-400">
                {{ notification.timestamp | date:'short' }}
              </p>
            </div>

            <!-- Actions -->
            <div class="ml-4 flex-shrink-0 flex">
              <button
                (click)="markAsRead(notification)"
                *ngIf="!notification.read"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                (click)="removeNotification(notification)"
                class="ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  animations: [
    trigger('notificationAnimation', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('*', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class NotificationsComponent implements OnInit {
  @Input() notifications: Notification[] = [];
  @Output() notificationRead = new EventEmitter<Notification>();
  @Output() notificationRemoved = new EventEmitter<Notification>();

  constructor() {}

  ngOnInit(): void {}

  markAsRead(notification: Notification): void {
    this.notificationRead.emit(notification);
  }

  removeNotification(notification: Notification): void {
    this.notificationRemoved.emit(notification);
  }
} 