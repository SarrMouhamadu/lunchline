import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionService } from '../../../core/services/promotion.service';
import { Promotion } from '../../../core/interfaces/promotion.interface';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Gestion des Promotions</h2>
            <p class="mt-1 text-sm text-gray-500">Gérez les promotions et offres spéciales</p>
          </div>
          <button
            (click)="openPromotionForm()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter une promotion
          </button>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex space-x-4">
          <div class="flex-1">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="filterPromotions()"
              placeholder="Rechercher une promotion..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            [(ngModel)]="statusFilter"
            (change)="filterPromotions()"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les promotions</option>
            <option value="active">Actives</option>
            <option value="expired">Expirées</option>
            <option value="scheduled">Planifiées</option>
          </select>
        </div>
      </div>

      <!-- Liste des promotions -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let promotion of filteredPromotions" class="bg-white shadow rounded-lg overflow-hidden">
          <div class="relative">
            <img
              [src]="promotion.image || 'assets/images/default-promotion.jpg'"
              [alt]="promotion.name"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-2 right-2">
              <span
                [ngClass]="{
                  'px-2 py-1 text-xs font-semibold rounded-full': true,
                  'bg-green-100 text-green-800': promotion.isActive,
                  'bg-red-100 text-red-800': !promotion.isActive
                }"
              >
                {{ promotion.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900">{{ promotion.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ promotion.description }}</p>
            <div class="mt-2">
              <div class="flex items-center text-sm text-gray-500">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Du {{ promotion.startDate | date:'short' }} au {{ promotion.endDate | date:'short' }}</span>
              </div>
              <div class="mt-1 flex items-center text-sm text-gray-500">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Réduction: {{ promotion.discountPercentage }}%</span>
              </div>
            </div>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ promotion.usageCount }} utilisations</span>
              <div class="flex space-x-2">
                <button
                  (click)="editPromotion(promotion)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Modifier
                </button>
                <button
                  (click)="togglePromotionStatus(promotion)"
                  [class.bg-red-100]="promotion.isActive"
                  [class.text-red-700]="promotion.isActive"
                  [class.bg-green-100]="!promotion.isActive"
                  [class.text-green-700]="!promotion.isActive"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {{ promotion.isActive ? 'Désactiver' : 'Activer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal d'ajout/modification de promotion -->
      <div *ngIf="showPromotionForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingPromotion ? 'Modifier la promotion' : 'Ajouter une promotion' }}
          </h3>
          <form (ngSubmit)="savePromotion()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                [(ngModel)]="promotionForm.name"
                name="name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                [(ngModel)]="promotionForm.description"
                name="description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="datetime-local"
                  [(ngModel)]="promotionForm.startDate"
                  name="startDate"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  type="datetime-local"
                  [(ngModel)]="promotionForm.endDate"
                  name="endDate"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Pourcentage de réduction</label>
              <input
                type="number"
                [(ngModel)]="promotionForm.discountPercentage"
                name="discountPercentage"
                min="0"
                max="100"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                [(ngModel)]="promotionForm.image"
                name="image"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="promotionForm.isActive"
                name="isActive"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Active</label>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                (click)="closePromotionForm()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ editingPromotion ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PromotionsComponent implements OnInit {
  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  searchQuery = '';
  statusFilter = 'all';
  showPromotionForm = false;
  editingPromotion: Promotion | null = null;
  promotionForm = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    discountPercentage: 0,
    image: '',
    isActive: true
  };

  constructor(private promotionService: PromotionService) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.promotionService.getPromotions().subscribe({
      next: (promotions) => {
        this.promotions = promotions;
        this.filterPromotions();
      },
      error: (error) => {
        console.error('Error loading promotions:', error);
      }
    });
  }

  filterPromotions(): void {
    this.filteredPromotions = this.promotions.filter(promotion => {
      const matchesSearch = promotion.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          promotion.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const now = new Date();
      const isActive = promotion.isActive && new Date(promotion.startDate) <= now && new Date(promotion.endDate) >= now;
      const isExpired = new Date(promotion.endDate) < now;
      const isScheduled = new Date(promotion.startDate) > now;

      let matchesStatus = true;
      if (this.statusFilter === 'active') matchesStatus = isActive;
      else if (this.statusFilter === 'expired') matchesStatus = isExpired;
      else if (this.statusFilter === 'scheduled') matchesStatus = isScheduled;

      return matchesSearch && matchesStatus;
    });
  }

  openPromotionForm(promotion?: Promotion): void {
    this.editingPromotion = promotion || null;
    if (promotion) {
      this.promotionForm = {
        ...promotion,
        startDate: new Date(promotion.startDate).toISOString().slice(0, 16),
        endDate: new Date(promotion.endDate).toISOString().slice(0, 16)
      };
    } else {
      this.promotionForm = {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        discountPercentage: 0,
        image: '',
        isActive: true
      };
    }
    this.showPromotionForm = true;
  }

  closePromotionForm(): void {
    this.showPromotionForm = false;
    this.editingPromotion = null;
  }

  savePromotion(): void {
    if (this.editingPromotion) {
      this.promotionService.updatePromotion(this.editingPromotion._id, this.promotionForm).subscribe({
        next: () => {
          this.loadPromotions();
          this.closePromotionForm();
        },
        error: (error) => {
          console.error('Error updating promotion:', error);
        }
      });
    } else {
      this.promotionService.createPromotion(this.promotionForm).subscribe({
        next: () => {
          this.loadPromotions();
          this.closePromotionForm();
        },
        error: (error) => {
          console.error('Error creating promotion:', error);
        }
      });
    }
  }

  editPromotion(promotion: Promotion): void {
    this.openPromotionForm(promotion);
  }

  togglePromotionStatus(promotion: Promotion): void {
    this.promotionService.updatePromotion(promotion._id, { isActive: !promotion.isActive }).subscribe({
      next: () => {
        this.loadPromotions();
      },
      error: (error) => {
        console.error('Error toggling promotion status:', error);
      }
    });
  }
} 