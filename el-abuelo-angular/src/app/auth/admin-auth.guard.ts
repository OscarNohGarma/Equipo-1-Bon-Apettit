import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.adminAuthService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/admin/login']); // Redirigir al login del admin si no está autenticado
      return false;
    }
  }
}
