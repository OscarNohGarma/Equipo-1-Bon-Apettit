import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { Usuario } from '../../../../core/models/usuario';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
declare var Swal: any;

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SpinnerComponent],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  providers: [UsuarioService],
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  usuarioItems: Usuario[] = [];
  loading: boolean = false;
  constructor(
    private usuarioService: UsuarioService,
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
    if (this.userForm.valid) {
      this.loading = true;
      const newUser = {
        ...this.userForm.value,
      }; // Agregar la URL de la imagen
      const find = this.usuarioItems.filter(
        (usuario) => usuario.user === newUser.user
      );
      if (find.length == 1) {
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

      this.usuarioService.add(newUser).subscribe(
        (response) => {
          //! console.log('Producto añadido exitosamente:', response);
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Usuario agregado!',
            text: 'El usuario se ha creado exitosamente.',
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
            this.router.navigate(['/admin/roles']);
          });
        },
        (error) => {
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Ocurrió un problema.',
            text: 'Error al crear el usuario.',
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
