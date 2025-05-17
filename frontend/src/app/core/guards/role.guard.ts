import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return (route: any) => {
    const requiredRole = route.data['role'];
    const userRole = authService.getUserRole();

    if (userRole === requiredRole) {
      return true;
    }

    return router.parseUrl('/login');
  };
}; 