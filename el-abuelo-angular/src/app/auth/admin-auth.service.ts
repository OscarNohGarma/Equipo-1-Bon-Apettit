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

  login(
    token: string,
    id: string,
    user: string,
    password: string,
    username: string,
    rol: string
  ): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('id', id); // Almacenar el nombre del usuario
      localStorage.setItem('user', user); // Almacenar el nombre del usuario
      localStorage.setItem('password', password); // Almacenar el nombre del usuario
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
  getId(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('id'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }
  getUsername(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('username'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }

  getUser(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('user'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }
  getPassword(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('password'); // Obtener el nombre del usuario desde localStorage
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
