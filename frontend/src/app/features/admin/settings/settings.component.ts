import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings.service';
import { Settings } from '../../../core/interfaces/settings.interface';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Paramètres</h2>
            <p class="mt-1 text-sm text-gray-500">Gérez les paramètres de l'application</p>
          </div>
        </div>
      </div>

      <!-- Formulaire des paramètres -->
      <div class="bg-white shadow rounded-lg p-6">
        <form (ngSubmit)="saveSettings()" class="space-y-6">
          <!-- Informations du restaurant -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Informations du restaurant</h3>
            <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom du restaurant</label>
                <input
                  type="text"
                  [(ngModel)]="settingsForm.restaurantName"
                  name="restaurantName"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email de contact</label>
                <input
                  type="email"
                  [(ngModel)]="settingsForm.contactEmail"
                  name="contactEmail"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  [(ngModel)]="settingsForm.phone"
                  name="phone"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  [(ngModel)]="settingsForm.address"
                  name="address"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Horaires d'ouverture -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Horaires d'ouverture</h3>
            <div class="mt-4 space-y-4">
              <div *ngFor="let day of weekDays" class="grid grid-cols-3 gap-4 items-center">
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-700">{{ day }}</label>
                </div>
                <div class="col-span-1">
                  <input
                    type="time"
                    [(ngModel)]="settingsForm.openingHours[day].open"
                    [name]="'open-' + day"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="col-span-1">
                  <input
                    type="time"
                    [(ngModel)]="settingsForm.openingHours[day].close"
                    [name]="'close-' + day"
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Paramètres de livraison -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Paramètres de livraison</h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Frais de livraison (€)</label>
                <input
                  type="number"
                  [(ngModel)]="settingsForm.deliveryFee"
                  name="deliveryFee"
                  min="0"
                  step="0.01"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Temps de livraison moyen (minutes)</label>
                <input
                  type="number"
                  [(ngModel)]="settingsForm.averageDeliveryTime"
                  name="averageDeliveryTime"
                  min="0"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Rayon de livraison (km)</label>
                <input
                  type="number"
                  [(ngModel)]="settingsForm.deliveryRadius"
                  name="deliveryRadius"
                  min="0"
                  step="0.1"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Paramètres de paiement -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Paramètres de paiement</h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Devise</label>
                <select
                  [(ngModel)]="settingsForm.currency"
                  name="currency"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="EUR">Euro (€)</option>
                  <option value="USD">Dollar ($)</option>
                  <option value="GBP">Livre (£)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Méthodes de paiement acceptées</label>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      [(ngModel)]="settingsForm.paymentMethods.cash"
                      name="cash"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label class="ml-2 block text-sm text-gray-900">Espèces</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      [(ngModel)]="settingsForm.paymentMethods.card"
                      name="card"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label class="ml-2 block text-sm text-gray-900">Carte bancaire</label>
                  </div>
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      [(ngModel)]="settingsForm.paymentMethods.mobile"
                      name="mobile"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label class="ml-2 block text-sm text-gray-900">Paiement mobile</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Paramètres de notification -->
          <div>
            <h3 class="text-lg font-medium text-gray-900">Paramètres de notification</h3>
            <div class="mt-4 space-y-4">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="settingsForm.notifications.email"
                  name="emailNotifications"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">Activer les notifications par email</label>
              </div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="settingsForm.notifications.sms"
                  name="smsNotifications"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">Activer les notifications par SMS</label>
              </div>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              (click)="resetForm()"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  settings: Settings | null = null;
  settingsForm: Settings = {
    restaurantName: '',
    contactEmail: '',
    phone: '',
    address: '',
    openingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' }
    },
    deliveryFee: 0,
    averageDeliveryTime: 30,
    deliveryRadius: 5,
    currency: 'EUR',
    paymentMethods: {
      cash: true,
      card: true,
      mobile: false
    },
    notifications: {
      email: true,
      sms: false
    }
  };

  weekDays = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche'
  ];

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings: Settings) => {
        this.settings = settings;
        this.settingsForm = { ...settings };
      },
      error: (error: Error) => {
        console.error('Error loading settings:', error);
      }
    });
  }

  saveSettings(): void {
    this.settingsService.updateSettings(this.settingsForm).subscribe({
      next: () => {
        this.loadSettings();
      },
      error: (error: Error) => {
        console.error('Error saving settings:', error);
      }
    });
  }

  resetForm(): void {
    if (this.settings) {
      this.settingsForm = { ...this.settings };
    }
  }
} 