import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpService } from '../../shared/services/http.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, SharedModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6">Panier</h1>
      
      <!-- Liste des articles -->
      <div *ngIf="cartItems.length > 0" class="space-y-4">
        <div *ngFor="let item of cartItems" class="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
          <div>
            <h3 class="font-bold">{{ item.name }}</h3>
            <p class="text-gray-600">{{ item.price }} FCFA x {{ item.quantity }}</p>
          </div>
          <div class="flex space-x-2">
            <button (click)="decreaseQuantity(item)" class="text-gray-500">-</button>
            <span>{{ item.quantity }}</span>
            <button (click)="increaseQuantity(item)" class="text-gray-500">+</button>
            <button (click)="removeFromCart(item.id)" class="text-red-500">Supprimer</button>
          </div>
        </div>
        
        <!-- Total -->
        <div class="mt-4 border-t pt-4">
          <div class="flex justify-between font-bold">
            <span>Total</span>
            <span>{{ total }} FCFA</span>
          </div>
          <button (click)="placeOrder()" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded w-full">
            Passer la commande
          </button>
        </div>
      </div>
      
      <!-- Panier vide -->
      <div *ngIf="cartItems.length === 0" class="text-center py-8">
        <p class="text-gray-600">Votre panier est vide</p>
      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor(private httpService: HttpService) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.httpService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCartItem(item);
    }
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.updateCartItem(item);
  }

  updateCartItem(item: any) {
    this.httpService.updateCartItem(item).subscribe(() => {
      this.calculateTotal();
    });
  }

  removeFromCart(itemId: string) {
    this.httpService.removeFromCart(itemId).subscribe(() => {
      this.loadCartItems();
    });
  }

  placeOrder() {
    if (this.cartItems.length === 0) return;

    const order = {
      items: this.cartItems,
      total: this.total,
      date: new Date().toISOString()
    };

    this.httpService.placeOrder(order).subscribe(() => {
      this.cartItems = [];
      this.total = 0;
    });
  }
}
