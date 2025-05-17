import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
            <p class="mt-1 text-sm text-gray-500">Gérez les utilisateurs de la plateforme</p>
          </div>
          <button
            (click)="openUserForm()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ajouter un utilisateur
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
              (input)="filterUsers()"
              placeholder="Rechercher un utilisateur..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            [(ngModel)]="roleFilter"
            (change)="filterUsers()"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="teacher">Enseignants</option>
            <option value="student">Étudiants</option>
          </select>
        </div>
      </div>

      <!-- Liste des utilisateurs -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of filteredUsers">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      [src]="user.avatar || 'assets/images/default-avatar.png'"
                      [alt]="user.name"
                      class="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                  'bg-purple-100 text-purple-800': user.role === 'admin',
                  'bg-blue-100 text-blue-800': user.role === 'teacher',
                  'bg-green-100 text-green-800': user.role === 'student'
                }">
                  {{ user.role | titlecase }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span [ngClass]="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                  'bg-green-100 text-green-800': user.isActive,
                  'bg-red-100 text-red-800': !user.isActive
                }">
                  {{ user.isActive ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-2">
                  <button
                    (click)="editUser(user)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Modifier
                  </button>
                  <button
                    (click)="toggleUserStatus(user)"
                    [class.bg-red-100]="user.isActive"
                    [class.text-red-700]="user.isActive"
                    [class.bg-green-100]="!user.isActive"
                    [class.text-green-700]="!user.isActive"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    {{ user.isActive ? 'Désactiver' : 'Activer' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal d'ajout/modification d'utilisateur -->
      <div *ngIf="showUserForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur' }}
          </h3>
          <form (ngSubmit)="saveUser()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                [(ngModel)]="userForm.name"
                name="name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                [(ngModel)]="userForm.email"
                name="email"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Rôle</label>
              <select
                [(ngModel)]="userForm.role"
                name="role"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="admin">Administrateur</option>
                <option value="teacher">Enseignant</option>
                <option value="student">Étudiant</option>
              </select>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="userForm.isActive"
                name="isActive"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">Actif</label>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                (click)="closeUserForm()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {{ editingUser ? 'Modifier' : 'Ajouter' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery = '';
  roleFilter = 'all';
  showUserForm = false;
  editingUser: User | null = null;
  userForm = {
    name: '',
    email: '',
    role: 'student',
    isActive: true
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers();
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesRole = this.roleFilter === 'all' || user.role === this.roleFilter;
      return matchesSearch && matchesRole;
    });
  }

  openUserForm(user?: User): void {
    this.editingUser = user || null;
    if (user) {
      this.userForm = { ...user };
    } else {
      this.userForm = {
        name: '',
        email: '',
        role: 'student',
        isActive: true
      };
    }
    this.showUserForm = true;
  }

  closeUserForm(): void {
    this.showUserForm = false;
    this.editingUser = null;
  }

  saveUser(): void {
    if (this.editingUser) {
      this.userService.updateUser(this.editingUser._id, this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserForm();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    } else {
      this.userService.createUser(this.userForm).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserForm();
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });
    }
  }

  editUser(user: User): void {
    this.openUserForm(user);
  }

  toggleUserStatus(user: User): void {
    this.userService.updateUser(user._id, { isActive: !user.isActive }).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error toggling user status:', error);
      }
    });
  }
}
