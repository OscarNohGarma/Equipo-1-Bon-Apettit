import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
    rol: string,
    phone?: string
  ): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('client-id', id); // Almacenar el nombre del usuario
      localStorage.setItem('client-user', user); // Almacenar el nombre del usuario
      localStorage.setItem('client-password', password); // Almacenar el nombre del usuario
      localStorage.setItem('client-username', username); // Almacenar el nombre del usuario
      localStorage.setItem('client-rol', rol); // Almacenar el nombre del usuario
      localStorage.setItem('client-phone', phone ? phone : ''); // Almacenar el nombre del usuario
    }
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('client-id'); // Almacenar el nombre del usuario
      localStorage.removeItem('client-user'); // Almacenar el nombre del usuario
      localStorage.removeItem('client-password'); // Almacenar el nombre del usuario
      localStorage.removeItem('client-username'); // Eliminar el nombre del usuario al cerrar sesión
      localStorage.removeItem('client-rol'); // Almacenar el nombre del usuario
      localStorage.removeItem('client-phone'); // Almacenar el nombre del usuario
    }
  }
  getId(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('client-id'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }
  getUsername(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('client-username'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }

  getUser(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('client-user'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }
  getPassword(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('client-password'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }
  getRol(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('client-rol'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }
  getPhone(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('client-phone'); // Obtener el nombre del usuario desde localStorage
    }
    return null;
  }
}
