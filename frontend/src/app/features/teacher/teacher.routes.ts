import { Routes } from '@angular/router';

export const TEACHER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./teacher-dashboard/teacher-dashboard.component').then(m => m.TeacherDashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'order',
        loadComponent: () => import('./order/order.component').then(m => m.OrderComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
]; 