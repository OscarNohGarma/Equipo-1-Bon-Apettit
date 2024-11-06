import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si el usuario está autenticado
    if (this.adminAuthService.isAuthenticated()) {
      const userRole = this.adminAuthService.getRol();

      if (
        userRole === 'DUEÑO' &&
        state.url !== '/admin/report' &&
        state.url !== '/admin/clientes' &&
        state.url !== '/admin/roles' &&
        state.url !== '/admin/roles/add' &&
        !state.url.startsWith('/admin/roles/edit/')
      ) {
        this.router.navigate(['/admin/report']);
        return false; // Bloquear la navegación original
      }
      // Si el usuario es cocinero y trata de acceder a otra ruta, redirigir a /admin/ordenes

      if (
        userRole === 'ADMINISTRADOR' &&
        state.url !== '/admin/menu' &&
        state.url !== '/admin/menu/add' &&
        state.url !== '/admin/comentarios' &&
        !state.url.startsWith('/admin/menu/edit/')
      ) {
        this.router.navigate(['/admin/menu']);
        return false; // Bloquear la navegación original
      }

      if (userRole === 'COCINERO' && state.url !== '/admin/ordenes/activas') {
        this.router.navigate(['/admin/ordenes/activas']);
        return false; // Bloquear la navegación original
      }

      if (userRole === 'CAJERO' && state.url !== '/admin/ordenes/listas') {
        this.router.navigate(['/admin/ordenes/listas']);
        return false; // Bloquear la navegación original
      }
      if (
        userRole === 'REPARTIDOR' &&
        state.url !== '/admin/ordenes/repartidor'
      ) {
        this.router.navigate(['/admin/ordenes/repartidor']);
        return false; // Bloquear la navegación original
      }
      return true; // Si no es cocinero o ya está en /admin/ordenes, permitir el acceso
    } else {
      // Redirigir al login si no está autenticado
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}
