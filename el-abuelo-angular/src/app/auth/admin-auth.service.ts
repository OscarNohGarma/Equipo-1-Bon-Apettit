import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  constructor() {}

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('auth_token');
      return !!token;
    }
    return false;
  }

  login(token: string, username: string, rol: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('username', username); // Almacenar el nombre del usuario
      localStorage.setItem('rol', rol); // Almacenar el nombre del usuario
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('username'); // Eliminar el nombre del usuario al cerrar sesión
      localStorage.removeItem('rol'); // Almacenar el nombre del usuario
    }
  }

  getUsername(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('username'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }

  getRol(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('rol'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }
}
