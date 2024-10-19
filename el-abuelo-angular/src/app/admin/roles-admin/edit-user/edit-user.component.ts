import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../core/models/usuario';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
  providers: [UsuarioService],
})
export class EditUserComponent implements OnInit {
  productForm: FormGroup;
  userId: string | null = null;
  usuario: Usuario | null = null;
  constructor(
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id'); // Obtén el ID del producto de la URL
    if (this.userId) {
      this.loadUser(this.userId); // Cargar el producto con el ID
    }
  }

  loadUser(id: string) {
    // Usar el método getMenuById que ya tienes en tu servicio
    this.usuarioService.getById(id).subscribe((usuario: Usuario) => {
      this.usuario = usuario;
      // Rellenar el formulario con los datos del producto
      this.productForm.patchValue({
        namee: usuario.namee,
        user: usuario.user,
        password: usuario.password,
        rol: usuario.rol,
      });
    });
  }

  saveUser() {
    if (this.productForm.valid && this.userId) {
      const updateUser = {
        ...this.productForm.value,
      }; // Agregar la URL de la imagen

      this.usuarioService.update(this.userId, updateUser).subscribe(
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
