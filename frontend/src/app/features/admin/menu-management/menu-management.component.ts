import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { Menu } from '../../../core/interfaces/menu.interface';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Gestion des menus</h2>
            <p class="mt-1 text-sm text-gray-500">Ajoutez et gérez les menus disponibles</p>
          </div>
          <button
            (click)="openNewMenuModal()"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Nouveau menu
          </button>
        </div>
      </div>

      <!-- Liste des menus -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Menus disponibles</h3>
        </div>
        <div class="border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let menu of menus">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ menu.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ menu.description }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ menu.price | currency:'XOF':'symbol-narrow':'1.0-0' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span [ngClass]="{
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                      'bg-green-100 text-green-800': menu.available,
                      'bg-red-100 text-red-800': !menu.available
                    }">
                      {{ menu.available ? 'Disponible' : 'Indisponible' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      (click)="editMenu(menu)"
                      class="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      (click)="toggleMenuAvailability(menu)"
                      [ngClass]="{
                        'text-green-600 hover:text-green-900': !menu.available,
                        'text-red-600 hover:text-red-900': menu.available
                      }"
                    >
                      {{ menu.available ? 'Désactiver' : 'Activer' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal de création/édition -->
      <div *ngIf="showModal" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form [formGroup]="menuForm" (ngSubmit)="onSubmit()" class="p-6">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{ editingMenu ? 'Modifier le menu' : 'Nouveau menu' }}
                </h3>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      id="name"
                      formControlName="name"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id="description"
                      formControlName="description"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label for="price" class="block text-sm font-medium text-gray-700">Prix</label>
                    <input
                      type="number"
                      id="price"
                      formControlName="price"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                  </div>
                  <div>
                    <label for="available" class="block text-sm font-medium text-gray-700">Disponibilité</label>
                    <div class="mt-1">
                      <label class="inline-flex items-center">
                        <input
                          type="checkbox"
                          formControlName="available"
                          class="form-checkbox h-4 w-4 text-indigo-600"
                        >
                        <span class="ml-2 text-sm text-gray-700">Menu disponible</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  [disabled]="!menuForm.valid"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {{ editingMenu ? 'Modifier' : 'Créer' }}
                </button>
                <button
                  type="button"
                  (click)="closeModal()"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MenuManagementComponent implements OnInit {
  menus: Menu[] = [];
  showModal = false;
  editingMenu: Menu | null = null;
  menuForm: FormGroup;

  constructor(
    private menuService: MenuService,
    private fb: FormBuilder
  ) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      available: [true]
    });
  }

  ngOnInit(): void {
    this.loadMenus();
  }

  private loadMenus(): void {
    this.menuService.getAllMenus().subscribe(menus => {
      this.menus = menus;
    });
  }

  openNewMenuModal(): void {
    this.editingMenu = null;
    this.menuForm.reset({ available: true });
    this.showModal = true;
  }

  editMenu(menu: Menu): void {
    this.editingMenu = menu;
    this.menuForm.patchValue({
      name: menu.name,
      description: menu.description,
      price: menu.price,
      available: menu.available
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingMenu = null;
    this.menuForm.reset();
  }

  onSubmit(): void {
    if (this.menuForm.valid) {
      const menuData = this.menuForm.value;
      if (this.editingMenu) {
        this.menuService.updateMenu(this.editingMenu.id, menuData).subscribe(() => {
          this.loadMenus();
          this.closeModal();
        });
      } else {
        this.menuService.createMenu(menuData).subscribe(() => {
          this.loadMenus();
          this.closeModal();
        });
      }
    }
  }

  toggleMenuAvailability(menu: Menu): void {
    this.menuService.updateMenu(menu.id, { available: !menu.available }).subscribe(() => {
      this.loadMenus();
    });
  }
} 