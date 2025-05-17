import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <!-- Navigation -->
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <span class="text-2xl font-bold">Lunchline</span>
          </div>
          <div class="hidden md:flex space-x-8">
            <a routerLink="/menu" class="text-gray-600 hover:text-blue-500">Menu</a>
            <a routerLink="/cart" class="text-gray-600 hover:text-blue-500">Panier</a>
            <a routerLink="/orders" class="text-gray-600 hover:text-blue-500">Commandes</a>
            <a routerLink="/profile" class="text-gray-600 hover:text-blue-500">Profil</a>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu -->
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-8">Bienvenue sur Lunchline</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Ajoutez vos composants ici -->
      </div>
    </div>
  `
})
export class HomeComponent { }
