import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private AuthService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado
    if (this.AuthService.isAuthenticated()) {
      return true;
    } else {
      // Redirigir al login si no está autenticado
      this.router.navigate(['/login']);
      return false;
    }
  }
}
