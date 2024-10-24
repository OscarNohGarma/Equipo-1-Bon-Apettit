import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { GaleriaInstalacionesComponent } from '../galeria-instalaciones/galeria-instalaciones.component';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterOutlet,
    GaleriaInstalacionesComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  currentUser: string | null = null;
  currentRol: string | null = null;
  currentId: string | null = null;
  currentName: string | null = null;
  isUserMenuOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.currentUser = this.authService.getUser();
    this.currentRol = this.authService.getRol(); // Obtener el nombre del usuario
    this.currentId = this.authService.getId(); // Obtener el nombre del usuario
    this.currentName = this.authService.getUsername(); // Obtener el nombre del usuario
  }
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      // Forzar la recarga de la página después de la navegación
      window.location.reload();
    });
  }
  onEdit() {
    this.router.navigate(['/admin/roles/edit', this.currentId]).then(() => {
      // Forzar la recarga de la página después de la navegación
      window.location.reload();
    });
  }
}
