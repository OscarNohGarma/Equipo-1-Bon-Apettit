import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { Usuario } from '../../core/models/usuario';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { AuthGuard } from '../../auth/auth.guard';
import { AuthService } from '../../auth/auth.service';

declare var Swal: any;
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SpinnerComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [UsuarioService, AuthGuard],
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  usuarioItems: Usuario[] = [];
  loading: boolean = false;
  registerForm: FormGroup;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      namee: [''],
      username: [''],
      phone: [''],
      password: [''],
      repassword: [''],
      // Otros campos que tengas en MenuProduct
    });
  }

  ngOnInit(): void {
    this.usuarioService.getAll().subscribe((data) => {
      this.usuarioItems = data.filter((usuario) => usuario.rol === 'CLIENTE');
    });
    console.log(this.usuarioItems);
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
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

    this.errorMessage = '';
    this.loading = true;
    // Buscar si el usuario ingresado existe en la lista de usuarios
    const foundUser = this.usuarioItems.find(
      (user) => user.user === this.username
    );
    setTimeout(() => {
      if (foundUser) {
        // Validar si la contraseña coincide
        if (foundUser.password === this.password) {
          // Login exitoso, simula el almacenamiento del token
          this.authService.login(
            'fake-token',
            foundUser.id.toString(),
            foundUser.user,
            foundUser.password,
            foundUser.namee,
            foundUser.rol,
            foundUser.phone
          ); // Aquí podrías pasar un token real si lo tienes
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: '¡Inicio de sesión exitoso!',
            text: 'Bienvenido a la página.',
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
            this.router.navigate(['/']).then(() => {
              // window.location.reload();
              setTimeout(() => {
                window.scroll(0, 0);
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }, 500);
            });
          });
        } else {
          // Contraseña incorrecta
          this.loading = false;
          Swal.fire({
            icon: 'error',
            title: 'Contraseña incorrecta.',
            text: 'Revisa que la contraseña es correcta.',
            confirmButtonText: 'Entendido',
            didOpen: () => {
              // Aplicar estilos directamente
              const confirmButton = Swal.getConfirmButton();

              if (confirmButton) {
                confirmButton.style.backgroundColor = '#343a40';
                confirmButton.style.transition = 'background-color 0.3s ease'; // Agregar transición

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
      } else {
        // Usuario no encontrado
        this.loading = false;
        Swal.fire({
          icon: 'error',
          title: 'Usuario no encontrado.',
          text: 'Revisa que el usuario es correcto.',
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
    }, 2000);
  }
}
