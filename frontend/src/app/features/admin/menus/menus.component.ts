import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../../core/services/menu.service';
import { Menu } from '../../../core/interfaces/menu.interface';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Gestion des Menus</h2>
            <p class="mt-1 text-sm text-gray-500">Gérez les menus disponibles dans le restaurant</p>
          </div>
          <button
            (click)="openMenuForm()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter un menu
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
              (input)="filterMenus()"
              placeholder="Rechercher un menu..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            [(ngModel)]="availabilityFilter"
            (change)="filterMenus()"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les menus</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">Non disponibles</option>
          </select>
        </div>
      </div>

      <!-- Liste des menus -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div *ngFor="let menu of filteredMenus" class="bg-white shadow rounded-lg overflow-hidden">
          <div class="relative">
            <img
              [src]="menu.image || 'assets/images/default-menu.jpg'"
              [alt]="menu.name"
              class="w-full h-48 object-cover"
            />
            <div class="absolute top-2 right-2">
              <span
                [ngClass]="{
                  'px-2 py-1 text-xs font-semibold rounded-full': true,
                  'bg-green-100 text-green-800': menu.isAvailable,
                  'bg-red-100 text-red-800': !menu.isAvailable
                }"
              >
                {{ menu.isAvailable ? 'Disponible' : 'Non disponible' }}
              </span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-medium text-gray-900">{{ menu.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ menu.description }}</p>
            <div class="mt-4 flex justify-between items-center">
              <span class="text-lg font-bold text-gray-900">{{ menu.price | currency:'EUR' }}</span>
              <div class="flex space-x-2">
                <button
                  (click)="editMenu(menu)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Modifier
                </button>
                <button
                  (click)="toggleAvailability(menu)"
                  [class.bg-red-100]="menu.isAvailable"
                  [class.text-red-700]="menu.isAvailable"
                  [class.bg-green-100]="!menu.isAvailable"
                  [class.text-green-700]="!menu.isAvailable"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  {{ menu.isAvailable ? 'Désactiver' : 'Activer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal d'ajout/modification de menu -->
      <div *ngIf="showMenuForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingMenu ? 'Modifier le menu' : 'Ajouter un menu' }}
          </h3>
          <form (ngSubmit)="saveMenu()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                [(ngModel)]="menuForm.name"
                name="name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                [(ngModel)]="menuForm.description"
                name="description"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Prix</label>
              <input
                type="number"
                [(ngModel)]="menuForm.price"
                name="price"
                step="0.01"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                [(ngModel)]="menuForm.image"
                name="image"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="menuForm.isAvailable"
                name="isAvailable"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Disponible</label>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                (click)="closeMenuForm()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ editingMenu ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class MenusComponent implements OnInit {
  menus: Menu[] = [];
  filteredMenus: Menu[] = [];
  searchQuery = '';
  availabilityFilter = 'all';
  showMenuForm = false;
  editingMenu: Menu | null = null;
  menuForm = {
    name: '',
    description: '',
    price: 0,
    image: '',
    isAvailable: true
  };

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus(): void {
    this.menuService.getMenus().subscribe({
      next: (menus) => {
        this.menus = menus;
        this.filterMenus();
      },
      error: (error) => {
        console.error('Error loading menus:', error);
      }
    });
  }

  filterMenus(): void {
    this.filteredMenus = this.menus.filter(menu => {
      const matchesSearch = menu.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          menu.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesAvailability = this.availabilityFilter === 'all' ||
                                (this.availabilityFilter === 'available' && menu.isAvailable) ||
                                (this.availabilityFilter === 'unavailable' && !menu.isAvailable);
      return matchesSearch && matchesAvailability;
    });
  }

  openMenuForm(menu?: Menu): void {
    this.editingMenu = menu || null;
    if (menu) {
      this.menuForm = { ...menu };
    } else {
      this.menuForm = {
        name: '',
        description: '',
        price: 0,
        image: '',
        isAvailable: true
      };
    }
    this.showMenuForm = true;
  }

  closeMenuForm(): void {
    this.showMenuForm = false;
    this.editingMenu = null;
  }

  saveMenu(): void {
    if (this.editingMenu) {
      this.menuService.updateMenu(this.editingMenu._id, this.menuForm).subscribe({
        next: () => {
          this.loadMenus();
          this.closeMenuForm();
        },
        error: (error) => {
          console.error('Error updating menu:', error);
        }
      });
    } else {
      this.menuService.createMenu(this.menuForm).subscribe({
        next: () => {
          this.loadMenus();
          this.closeMenuForm();
        },
        error: (error) => {
          console.error('Error creating menu:', error);
        }
      });
    }
  }

  editMenu(menu: Menu): void {
    this.openMenuForm(menu);
  }

  toggleAvailability(menu: Menu): void {
    this.menuService.updateMenu(menu._id, { isAvailable: !menu.isAvailable }).subscribe({
      next: () => {
        this.loadMenus();
      },
      error: (error) => {
        console.error('Error toggling menu availability:', error);
      }
    });
  }
}
