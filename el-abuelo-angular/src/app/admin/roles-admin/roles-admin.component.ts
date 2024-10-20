import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario';
import { AdminAuthService } from '../../auth/admin-auth.service';

@Component({
  selector: 'app-roles-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './roles-admin.component.html',
  styleUrl: './roles-admin.component.scss',
  providers: [UsuarioService, AdminAuthService],
})
export class RolesAdminComponent implements OnInit {
  usuarioItems: Usuario[] = [];

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.usuarioService.getAll().subscribe((data) => {
      this.usuarioItems = data.filter(
        (usuario) => usuario.id.toString() !== this.adminAuthService.getId()
      );
    });
  }
  deleteUser(id: number) {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar este usuario?'
    );
    if (confirmed) {
      this.usuarioService.delete(id.toString()).subscribe(
        (response) => {
          // console.log('Producto eliminado:', response);
          // Aquí puedes agregar lógica para actualizar la vista
          setTimeout(() => {
            alert('Usuario eliminado correctamente.');
            this.loadUser(); // Por ejemplo, recargar el menú
          }, 500);
        },
        (error) => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
  }
}
