import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario';
import { AdminAuthService } from '../../auth/admin-auth.service';
declare var Swal: any;

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
    Swal.fire({
      icon: 'warning',
      title: '¿Deseas eliminar este usuario?',
      text: 'Esta acción eliminará este usuario para siempre.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false, // Desactivar estilos predeterminados de SweetAlert2
      didOpen: () => {
        // Aplicar estilos directamente
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton) {
          confirmButton.style.backgroundColor = '#fff';
          confirmButton.style.color = '#dc3545';
          confirmButton.style.padding = '10px 20px';
          confirmButton.style.fontWeight = 'bold';
          confirmButton.style.border = 'none';
          confirmButton.style.border = '2px solid #dc3545';
          confirmButton.style.borderRadius = '5px';
          confirmButton.style.transition = 'background-color 0.3s ease'; // Agregar transición
          confirmButton.style.marginRight = '10px'; // Agregar transición

          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#dc3545'; // Color en hover
            confirmButton.style.color = '#fff';
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#fff'; // Color normal
            confirmButton.style.color = '#dc3545';
          };
        }

        if (cancelButton) {
          cancelButton.style.backgroundColor = '#343a40';
          cancelButton.style.color = '#fff';
          cancelButton.style.padding = '10px 20px';
          cancelButton.style.fontWeight = 'bold';
          cancelButton.style.border = 'none';
          cancelButton.style.border = '2px solid #343a40';
          cancelButton.style.borderRadius = '5px';
          cancelButton.style.transition = 'background-color 0.3s ease'; // Agregar transición

          cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = '#24272b'; // Color en hover
          };
          cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#343a40'; // Color normal
          };
        }
      },
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(id.toString()).subscribe(
          (response) => {
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado!',
                text: 'El Usuario se eliminó correctamente.',
                confirmButtonText: 'Aceptar',
                didOpen: () => {
                  // Aplicar estilos directamente
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton) {
                    confirmButton.style.backgroundColor = '#343a40';

                    confirmButton.onmouseover = () => {
                      confirmButton.style.backgroundColor = '#212529'; // Color en hover
                    };
                    confirmButton.onmouseout = () => {
                      confirmButton.style.backgroundColor = '#343a40'; // Color normal
                    };
                  }
                },
              }).then((result: any) => {
                this.loadUser(); // Recargar el menú después de eliminar el producto
              });
            }, 100);
          },
          (error) => {
            console.error('Error al eliminar el usuario:', error);
          }
        );
      }
    });
  }
}
