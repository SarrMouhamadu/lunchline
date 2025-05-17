import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor() {}

  login(email: string, password: string): Promise<any> {
    // Ici, vous pouvez implémenter la logique d'authentification
    // Pour l'instant, on utilise des données statiques
    const user = {
      id: '1',
      email: email,
      name: 'Utilisateur Test',
      role: 'user'
    };
    
    this.userSubject.next(user);
    this.tokenSubject.next('token-test');
    return Promise.resolve(user);
  }

  logout() {
    this.userSubject.next(null);
    this.tokenSubject.next(null);
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  getToken() {
    return this.tokenSubject.asObservable();
  }

  isLoggedIn() {
    return !!this.userSubject.value;
  }

  isAdmin() {
    return this.userSubject.value?.role === 'admin';
  }
}
