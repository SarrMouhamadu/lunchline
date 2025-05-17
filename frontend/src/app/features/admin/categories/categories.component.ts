import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/interfaces/category.interface';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Gestion des Catégories</h2>
            <p class="mt-1 text-sm text-gray-500">Gérez les catégories de menus</p>
          </div>
          <button
            (click)="openCategoryForm()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter une catégorie
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
              (input)="filterCategories()"
              placeholder="Rechercher une catégorie..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            [(ngModel)]="availabilityFilter"
            (change)="filterCategories()"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">Non disponibles</option>
          </select>
        </div>
      </div>

      <!-- Liste des catégories -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let category of filteredCategories" class="bg-white shadow rounded-lg overflow-hidden">
          <div class="relative">
            <img
              [src]="category.image || 'assets/images/default-category.jpg'"
              [alt]="category.name"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-2 right-2">
              <span
                [ngClass]="{
                  'px-2 py-1 text-xs font-semibold rounded-full': true,
                  'bg-green-100 text-green-800': category.isAvailable,
                  'bg-red-100 text-red-800': !category.isAvailable
                }"
              >
                {{ category.isAvailable ? 'Disponible' : 'Non disponible' }}
              </span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900">{{ category.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ category.description }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm text-gray-500">{{ category.menuCount }} menus</span>
              <div class="flex space-x-2">
                <button
                  (click)="editCategory(category)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Modifier
                </button>
                <button
                  (click)="toggleAvailability(category)"
                  [class.bg-red-100]="category.isAvailable"
                  [class.text-red-700]="category.isAvailable"
                  [class.bg-green-100]="!category.isAvailable"
                  [class.text-green-700]="!category.isAvailable"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {{ category.isAvailable ? 'Désactiver' : 'Activer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal d'ajout/modification de catégorie -->
      <div *ngIf="showCategoryForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie' }}
          </h3>
          <form (ngSubmit)="saveCategory()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                [(ngModel)]="categoryForm.name"
                name="name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                [(ngModel)]="categoryForm.description"
                name="description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                [(ngModel)]="categoryForm.image"
                name="image"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="categoryForm.isAvailable"
                name="isAvailable"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Disponible</label>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                (click)="closeCategoryForm()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ editingCategory ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchQuery = '';
  availabilityFilter = 'all';
  showCategoryForm = false;
  editingCategory: Category | null = null;
  categoryForm = {
    name: '',
    description: '',
    image: '',
    isAvailable: true
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.filterCategories();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  filterCategories(): void {
    this.filteredCategories = this.categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          category.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesAvailability = this.availabilityFilter === 'all' ||
                                (this.availabilityFilter === 'available' && category.isAvailable) ||
                                (this.availabilityFilter === 'unavailable' && !category.isAvailable);
      return matchesSearch && matchesAvailability;
    });
  }

  openCategoryForm(category?: Category): void {
    this.editingCategory = category || null;
    if (category) {
      this.categoryForm = { ...category };
    } else {
      this.categoryForm = {
        name: '',
        description: '',
        image: '',
        isAvailable: true
      };
    }
    this.showCategoryForm = true;
  }

  closeCategoryForm(): void {
    this.showCategoryForm = false;
    this.editingCategory = null;
  }

  saveCategory(): void {
    if (this.editingCategory) {
      this.categoryService.updateCategory(this.editingCategory._id, this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCategoryForm();
        },
        error: (error) => {
          console.error('Error updating category:', error);
        }
      });
    } else {
      this.categoryService.createCategory(this.categoryForm).subscribe({
        next: () => {
          this.loadCategories();
          this.closeCategoryForm();
        },
        error: (error) => {
          console.error('Error creating category:', error);
        }
      });
    }
  }

  editCategory(category: Category): void {
    this.openCategoryForm(category);
  }

  toggleAvailability(category: Category): void {
    this.categoryService.updateCategory(category._id, { isAvailable: !category.isAvailable }).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error toggling category availability:', error);
      }
    });
  }
} 