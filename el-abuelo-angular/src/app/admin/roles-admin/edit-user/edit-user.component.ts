import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../core/models/usuario';
import { AdminAuthService } from '../../../auth/admin-auth.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
declare var Swal: any;

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SpinnerComponent],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
  providers: [UsuarioService, AdminAuthService],
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null;
  usuario: Usuario | null = null;
  currentId: string | null = null;
  currentEditUserId: number | null = null;
  currentRol: string | null = null;
  usuarioItems: Usuario[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private adminAuthService: AdminAuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      namee: [''],
      user: [''],
      password: [''],
      rol: [''],
      // Otros campos que tengas en MenuProduct
    });
  }

  ngOnInit(): void {
    this.usuarioService.getAll().subscribe((data) => {
      this.usuarioItems = data;
    });
    this.currentId = this.adminAuthService.getId();
    this.currentRol = this.adminAuthService.getRol();
    this.userId = this.route.snapshot.paramMap.get('id'); // Obtén el ID del producto de la URL
    if (this.userId) {
      this.loadUser(this.userId); // Cargar el producto con el ID
    }
    if (this.currentId === this.userId) {
      this.userForm.get('rol')?.disable();
      return;
    }
  }

  loadUser(id: string) {
    // Usar el método getMenuById que ya tienes en tu servicio
    this.usuarioService.getById(id).subscribe((usuario: Usuario) => {
      this.usuario = usuario;
      this.currentEditUserId = usuario.id;
      // Rellenar el formulario con los datos del producto
      this.userForm.patchValue({
        namee: usuario.namee,
        user: usuario.user,
        password: usuario.password,
        rol: usuario.rol,
      });
    });
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Campos requeridos.',
        text: 'Por favor llena todos los campos.',
        confirmButtonText: 'Entendido',
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
      });
      return;
    }
    if (this.userForm.valid && this.userId) {
      this.loading = true;
      const updateUser = {
        ...this.userForm.value,
      }; // Agregar la URL de la imagen

      const find = this.usuarioItems.filter(
        (usuario) => usuario.user === updateUser.user
      );
      if (find.length == 1) {
        if (find[0].id !== this.currentEditUserId) {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Usuario existente.',
            text: 'Ya existe un perfil con este usuario.',
            confirmButtonText: 'Entendido',
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
          });
          return;
        }
      }

      this.usuarioService.update(this.userId, updateUser).subscribe(
        (response) => {
          if (this.currentId === this.userId) {
            const updateUser = {
              ...this.userForm.value,
              rol: this.currentRol,
            };
            const us = this.userId ?? '';

            this.adminAuthService.login(
              'fake-token',
              us,
              updateUser.user,
              updateUser.password,
              updateUser.namee,
              updateUser.rol
            );
          }

          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Usuario actualizado!',
            text: 'El usuario se ha actualizado exitosamente.',
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
            this.router.navigate(['/admin/roles']).then(() => {
              window.location.reload();
            });
          });
        },
        (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un problema.',
            text: 'Error al actualizar el usuario.',
            confirmButtonText: 'Entendido',
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
          });
        }
      );
    }
  }
}
