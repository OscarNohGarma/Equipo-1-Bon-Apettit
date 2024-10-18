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

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.adminAuthService.getUsername(); // Obtener el nombre del usuario
  }

  onLogout() {
    this.adminAuthService.logout();
    this.router.navigate(['/admin/login']).then(() => {
      // Forzar la recarga de la página después de la navegación
      window.location.reload();
    });
  }
}
