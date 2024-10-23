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

      // Si el usuario es cocinero y trata de acceder a otra ruta, redirigir a /admin/ordenes
      if (userRole === 'COCINERO' && state.url !== '/admin/ordenes') {
        this.router.navigate(['/admin/ordenes']);
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
