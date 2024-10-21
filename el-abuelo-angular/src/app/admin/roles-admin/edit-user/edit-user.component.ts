import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../core/models/usuario';
import { AdminAuthService } from '../../../auth/admin-auth.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
  providers: [UsuarioService, AdminAuthService],
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null;
  usuario: Usuario | null = null;
  currentId: string | null = null;
  currentRol: string | null = null;

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
      alert('Por favor llena todos los campos.');
      return;
    }
    if (this.userForm.valid && this.userId) {
      const updateUser = {
        ...this.userForm.value,
      }; // Agregar la URL de la imagen

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

          alert('El Usuario se ha actualizado correctamente.');
          this.router.navigate(['/admin/roles']).then(() => {
            // Forzar la recarga de la página después de la navegación
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error al crear el usuario:', error);
        }
      );
    } else {
      console.error('Formulario inválido');
      alert('Por favor llena todos los campos.');
    }
  }
}
