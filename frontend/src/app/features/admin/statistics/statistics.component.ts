import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MenuService } from '../../../core/services/menu.service';
import { Order, OrderStatus } from '../../../core/interfaces/order.interface';
import { Menu } from '../../../core/interfaces/menu.interface';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-bold text-gray-900">Statistiques détaillées</h2>
        <p class="mt-1 text-sm text-gray-500">Analyse des performances et tendances</p>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Commandes par jour -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Commandes par jour</h3>
          <canvas id="ordersChart"></canvas>
        </div>

        <!-- Menus les plus populaires -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Menus les plus populaires</h3>
          <canvas id="menusChart"></canvas>
        </div>

        <!-- Temps moyen de préparation -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Temps moyen de préparation</h3>
          <canvas id="preparationTimeChart"></canvas>
        </div>

        <!-- Taux de satisfaction -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Taux de satisfaction</h3>
          <canvas id="satisfactionChart"></canvas>
        </div>
      </div>

      <!-- Statistiques détaillées -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Métriques clés</h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt class="text-sm font-medium text-gray-500 truncate">Taux de conversion</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ conversionRate }}%</dd>
            </div>
            <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt class="text-sm font-medium text-gray-500 truncate">Panier moyen</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ averageOrderValue | currency:'XOF':'symbol-narrow':'1.0-0' }}</dd>
            </div>
            <div class="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
              <dt class="text-sm font-medium text-gray-500 truncate">Taux d'annulation</dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">{{ cancellationRate }}%</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  `
})
export class StatisticsComponent implements OnInit {
  conversionRate = 0;
  averageOrderValue = 0;
  cancellationRate = 0;

  constructor(
    private orderService: OrderService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    // Charger les données pour les graphiques
    this.orderService.getAllOrders().subscribe(orders => {
      this.createOrdersChart(orders);
      this.createMenusChart(orders);
      this.createPreparationTimeChart(orders);
      this.createSatisfactionChart(orders);
      this.calculateMetrics(orders);
    });
  }

  private createOrdersChart(orders: Order[]): void {
    const ctx = document.getElementById('ordersChart') as HTMLCanvasElement;
    const last7Days = this.getLast7Days();
    const ordersByDay = this.groupOrdersByDay(orders, last7Days);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days.map(date => date.toLocaleDateString('fr-FR', { weekday: 'short' })),
        datasets: [{
          label: 'Nombre de commandes',
          data: last7Days.map(date => ordersByDay[date.toISOString()] || 0),
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  private createMenusChart(orders: Order[]): void {
    const ctx = document.getElementById('menusChart') as HTMLCanvasElement;
    const menuStats = this.getMenuStatistics(orders);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: menuStats.map(stat => stat.name),
        datasets: [{
          data: menuStats.map(stat => stat.count),
          backgroundColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
            'rgb(139, 92, 246)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });
  }

  private createPreparationTimeChart(orders: Order[]): void {
    const ctx = document.getElementById('preparationTimeChart') as HTMLCanvasElement;
    const preparationTimes = this.calculatePreparationTimes(orders);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['< 5 min', '5-10 min', '10-15 min', '15-20 min', '> 20 min'],
        datasets: [{
          label: 'Nombre de commandes',
          data: preparationTimes,
          backgroundColor: 'rgb(59, 130, 246)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  private createSatisfactionChart(orders: Order[]): void {
    const ctx = document.getElementById('satisfactionChart') as HTMLCanvasElement;
    const satisfactionData = this.calculateSatisfactionRate(orders);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Satisfait', 'Neutre', 'Insatisfait'],
        datasets: [{
          data: satisfactionData,
          backgroundColor: [
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }

  private getLast7Days(): Date[] {
    const dates: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dates.push(date);
    }
    return dates;
  }

  private groupOrdersByDay(orders: Order[], dates: Date[]): { [key: string]: number } {
    return orders.reduce((acc, order) => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      const dateKey = orderDate.toISOString();
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  private getMenuStatistics(orders: Order[]): { name: string; count: number }[] {
    const menuCounts = orders.reduce((acc, order) => {
      const menuName = order.menu?.name || 'Inconnu';
      acc[menuName] = (acc[menuName] || 0) + order.quantity;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(menuCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private calculatePreparationTimes(orders: Order[]): number[] {
    const times = [0, 0, 0, 0, 0];
    orders.forEach(order => {
      if (order.estimatedPickupTime) {
        const prepTime = (new Date(order.estimatedPickupTime).getTime() - new Date(order.createdAt).getTime()) / 60000;
        if (prepTime < 5) times[0]++;
        else if (prepTime < 10) times[1]++;
        else if (prepTime < 15) times[2]++;
        else if (prepTime < 20) times[3]++;
        else times[4]++;
      }
    });
    return times;
  }

  private calculateSatisfactionRate(orders: Order[]): number[] {
    // Simulation de données de satisfaction (à remplacer par des vraies données)
    return [70, 20, 10];
  }

  private calculateMetrics(orders: Order[]): void {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
    const cancelledOrders = orders.filter(order => order.status === 'CANCELLED').length;
    const totalValue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    this.conversionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;
    this.averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
    this.cancellationRate = totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0;
  }
} 