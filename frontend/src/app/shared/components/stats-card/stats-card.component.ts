import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="bg-white rounded-lg shadow-lg p-6"
      [@cardAnimation]
      [ngClass]="{
        'border-t-4': true,
        'border-blue-500': color === 'blue',
        'border-green-500': color === 'green',
        'border-yellow-500': color === 'yellow',
        'border-red-500': color === 'red',
        'border-purple-500': color === 'purple'
      }"
    >
      <div class="flex items-center">
        <!-- Icône -->
        <div
          class="flex-shrink-0 p-3 rounded-md"
          [ngClass]="{
            'bg-blue-100': color === 'blue',
            'bg-green-100': color === 'green',
            'bg-yellow-100': color === 'yellow',
            'bg-red-100': color === 'red',
            'bg-purple-100': color === 'purple'
          }"
        >
          <ng-content select="[icon]"></ng-content>
        </div>

        <!-- Contenu -->
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ title }}
            </dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900">
                {{ value }}
              </div>
              <div
                *ngIf="change"
                class="ml-2 flex items-baseline text-sm font-semibold"
                [ngClass]="{
                  'text-green-600': change > 0,
                  'text-red-600': change < 0
                }"
              >
                <svg
                  *ngIf="change > 0"
                  class="self-center flex-shrink-0 h-5 w-5 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  *ngIf="change < 0"
                  class="self-center flex-shrink-0 h-5 w-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="sr-only">
                  {{ change > 0 ? 'Augmentation' : 'Diminution' }} de
                </span>
                {{ change }}%
              </div>
            </dd>
          </dl>
        </div>
      </div>

      <!-- Description -->
      <div *ngIf="description" class="mt-4">
        <p class="text-sm text-gray-500">
          {{ description }}
        </p>
      </div>
    </div>
  `,
  animations: [
    trigger('cardAnimation', [
      state('void', style({
        transform: 'scale(0.95)',
        opacity: 0
      })),
      state('*', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      transition(':enter', [
        animate('200ms ease-out')
      ]),
      transition(':leave', [
        animate('200ms ease-in')
      ])
    ])
  ]
})
export class StatsCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() description = '';
  @Input() change?: number;
  @Input() color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' = 'blue';
} 