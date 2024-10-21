import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  providers: [UsuarioService],
})
export class AddUserComponent {
  userForm: FormGroup;
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
  saveUser() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      alert('Por favor llena todos los campos.');
      return;
    }
    if (this.userForm.valid) {
      const newUser = {
        ...this.userForm.value,
      }; // Agregar la URL de la imagen

      this.usuarioService.add(newUser).subscribe(
        (response) => {
          //! console.log('Producto añadido exitosamente:', response);
          alert('El Usuario se ha creado correctamente.');
          this.router.navigate(['/admin/roles']);
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
