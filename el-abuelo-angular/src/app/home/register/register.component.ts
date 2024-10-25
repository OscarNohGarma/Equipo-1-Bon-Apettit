import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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
      namee: ['', Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)],
      username: [''],
      phone: ['', Validators.pattern(/^[0-9]{10}$/)],
      password: ['', Validators.minLength(10)],
      repassword: [''],
    });
  }

  ngOnInit(): void {
    this.usuarioService.getAll().subscribe((data) => {
      this.usuarioItems = data.filter((usuario) => usuario.rol === 'CLIENTE');
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.showPopup(
        'error',
        'Campos incorrectos.',
        'Por favor llena correctamente todos los campos.'
      );
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    if (this.registerForm.valid) {
      if (
        this.registerForm.value.password !== this.registerForm.value.repassword
      ) {
        this.loading = false;
        this.showPopup(
          'error',
          'Contraseñas erróneas.',
          'Las contraseñas no coinciden.'
        );
        return;
      }

      const newUser = {
        ...this.registerForm.value,
        user: this.registerForm.value.username,
        rol: 'CLIENTE',
      };
      delete newUser.username;
      delete newUser.repassword;

      const foundUser = this.usuarioItems.find(
        (user) => user.user === newUser.user
      );

      if (foundUser) {
        this.loading = false;
        this.showPopup(
          'error',
          'Usuario existente',
          'Ya existe una cuenta con este usuario'
        );
        return;
      }

      this.usuarioService.add(newUser).subscribe(
        (response) => {
          this.loading = false;
          this.showPopup(
            'success',
            '!Cuenta creada!',
            'Tu cuenta se creó correctamente.'
          ).then((result: any) => {
            this.router.navigate(['/']);
          });
        },
        (error) => {
          this.loading = false;
          this.showPopup(
            'error',
            'Ocurrió un problema.',
            'Error al crear tu cuenta.'
          );
        }
      );
    }
  }
  showPopup(icon: 'success' | 'error', title: string, text: string) {
    return Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: 'Entendido',
      didOpen: () => {
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
}
