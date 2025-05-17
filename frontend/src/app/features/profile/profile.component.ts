import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Mon Profil</h1>
      
      <!-- Formulaire de profil -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nom</label>
            <input [(ngModel)]="user.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input [(ngModel)]="user.email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input [(ngModel)]="user.phone" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Adresse</label>
            <textarea [(ngModel)]="user.address" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <button (click)="updateProfile()" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Mettre à jour
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    // Ici, vous pouvez ajouter la logique pour charger le profil utilisateur depuis l'API
    // Pour l'instant, on utilise des données statiques
    this.user = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+221 77 123 45 67',
      address: '123 Rue de la Paix, Dakar'
    };
  }

  updateProfile() {
    this.httpService.updateUser('1', this.user).subscribe(response => {
      console.log('Profil mis à jour:', response);
    });
  }
}
