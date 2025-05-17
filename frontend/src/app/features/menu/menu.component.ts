import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Menu</h1>
      
      <!-- Formulaire d'ajout de plat -->
      <div class="mb-8">
        <button (click)="showAddForm = !showAddForm" class="bg-blue-500 text-white px-4 py-2 rounded">
          {{ showAddForm ? 'Annuler' : 'Ajouter un plat' }}
        </button>
      <!-- Liste des plats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let item of menuItems" class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-2">{{ item.name }}</h2>
          <p class="text-gray-600 mb-4">{{ item.description }}</p>
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">{{ item.price }} FCFA</span>
            <button (click)="addToCart(item)" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      <!-- Formulaire d'ajout de plat -->
      <div class="mt-8">
        <h2 class="text-2xl font-bold mb-4">Ajouter un plat</h2>
        <form (ngSubmit)="addMenuItem()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <input [(ngModel)]="newItem.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea [(ngModel)]="newItem.description" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Prix</label>
            <input [(ngModel)]="newItem.price" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          </div>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  `
})
export class MenuComponent implements OnInit {
  menuItems: any[] = [];
  showAddForm = false;
  newItem: any = {
    name: '',
    description: '',
    price: 0
  };

  constructor(private httpService: HttpService) {
    this.loadMenuItems();
  }

  ngOnInit() {
    this.newItem = {
      name: '',
      description: '',
      price: 0
    };
  }

  loadMenuItems() {
    this.httpService.getMenus().subscribe(items => {
      this.menuItems = items;
    });
  }

  addMenuItem() {
    if (this.newItem.name && this.newItem.description && this.newItem.price > 0) {
      this.httpService.addMenu(this.newItem).subscribe(() => {
        this.loadMenuItems();
        this.newItem = {
          name: '',
          description: '',
          price: 0
        };
      });
    }
  }

  addToCart(item: any) {
    this.httpService.addToCart(item).subscribe(() => {
      // TODO: Afficher une notification
    });
  }
}
