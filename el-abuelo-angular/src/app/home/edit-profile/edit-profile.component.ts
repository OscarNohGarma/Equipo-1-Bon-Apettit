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
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    SpinnerComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  providers: [UsuarioService, AuthGuard],
})
export class EditProfileComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  usuario: Usuario | null = null;
  loading: boolean = false;
  editForm: FormGroup;
  currentId: string | null = null;
  currentPass: string | null = null;
  currentUser: string | null = null;
  currentRol: string | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.editForm = this.fb.group({
      namee: ['', Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)],
      phone: ['', Validators.pattern(/^[0-9]{10}$/)],
      // username: [''],
      // password: ['', Validators.minLength(10)],
      // repassword: [''],
    });
  }

  ngOnInit(): void {
    this.currentId = this.authService.getId();
    this.currentPass = this.authService.getPassword();
    this.currentUser = this.authService.getUser();
    this.currentRol = this.authService.getRol();

    if (this.currentId) {
      this.usuarioService
        .getById(this.currentId)
        .subscribe((usuario: Usuario) => {
          this.usuario = usuario;
          this.editForm.patchValue({
            namee: usuario.namee,
            phone: usuario.phone,
          });
        });
    }
  }

  register() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.showPopup(
        'error',
        'Campos incorrectos.',
        'Por favor llena correctamente todos los campos.'
      );
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    if (this.editForm.valid) {
      const updateUser = {
        ...this.editForm.value,
        id: this.currentId,
        password: this.currentPass,
        user: this.currentUser,
        rol: this.currentRol,
      };

      this.usuarioService.update(updateUser.id, updateUser).subscribe(
        (response) => {
          this.authService.login(
            'fake-token',
            updateUser.id,
            updateUser.user,
            updateUser.password,
            updateUser.namee,
            updateUser.rol,
            updateUser.phone
          );
          this.loading = false;
          this.showPopup(
            'success',
            '!Cuenta actualizada!',
            'Tu cuenta se actualizó correctamente.'
          ).then((result: any) => {
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
        },
        (error) => {
          this.loading = false;
          this.showPopup(
            'error',
            'Ocurrió un problema.',
            'Error al actualizar tu cuenta.'
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
      confirmButtonText: icon === 'success' ? 'Aceptar' : 'Entendido',
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
