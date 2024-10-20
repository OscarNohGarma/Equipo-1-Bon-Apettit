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
  productForm: FormGroup;
  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      namee: [''],
      user: [''],
      password: [''],
      rol: [''],
      // Otros campos que tengas en MenuProduct
    });
  }
  saveUser() {
    if (this.productForm.valid) {
      const newUser = {
        ...this.productForm.value,
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
