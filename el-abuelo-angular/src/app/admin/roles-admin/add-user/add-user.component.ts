import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../core/models/usuario';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
  providers: [UsuarioService],
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  usuarioItems: Usuario[] = [];
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
      alert('Por favor llena todos los campos.');
      return;
    }
    if (this.userForm.valid) {
      const newUser = {
        ...this.userForm.value,
      }; // Agregar la URL de la imagen

      const find = this.usuarioItems.filter(
        (usuario) => usuario.user === newUser.user
      );
      if (find.length == 1) {
        alert('Ya existe un perfil con este usuario');
        return;
      }

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
