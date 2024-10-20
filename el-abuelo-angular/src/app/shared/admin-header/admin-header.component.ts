import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AdminAuthService } from '../../auth/admin-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss',
})
export class AdminHeaderComponent implements OnInit {
  currentUser: string | null = null;
  currentRol: string | null = null;
  rol: string | null = null;
  selectedCategory: string = 'TODOS'; // Categoría por defecto
  isMenuOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  isUserMenuOpen: boolean = false; // Para controlar la visibilidad del menú desplegable

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.adminAuthService.getUsername(); // Obtener el nombre del usuario
    this.currentRol = this.adminAuthService.getRol(); // Obtener el nombre del usuario
    this.rol = this.adminAuthService.getRol(); // Obtener el nombre del usuario
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      this.selectedCategory = savedCategory; // Restaurar la categoría seleccionada
    }
  }

  onLogout() {
    this.adminAuthService.logout();
    this.router.navigate(['/admin/login']).then(() => {
      // Forzar la recarga de la página después de la navegación
      window.location.reload();
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.isMenuOpen = false; // Cierra el menú después de seleccionar una opción
    localStorage.setItem('selectedCategory', category); // Guardar en localStorage
  }
}
