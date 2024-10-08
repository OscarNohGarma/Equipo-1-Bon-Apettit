import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { MenuProduct } from '../../../core/models/menuProduct';
import { CommonModule } from '@angular/common';
import { log } from 'console';
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
  providers: [MenuService],
})
export class AddProductComponent {
  productForm: FormGroup;
  productId: string | null = null;
  product: MenuProduct | null = null;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      namee: [''],
      precio: [''],
      image: [''],
      categoria: [''],
      // Otros campos que tengas en MenuProduct
    });
  }

  saveProduct() {
    if (this.productForm.valid) {
      const newProduct = { ...this.productForm.value }; // Agregar el ID al objeto
      console.log(newProduct);
      // return;
      this.menuService.addMenuItem(newProduct).subscribe(
        (response) => {
          console.log('Producto añadido exitosamente:', response);
          setTimeout(() => {
            alert('El producto se ha añadido correctamente.'); // Muestra la alerta
            this.router.navigate(['/admin/menu']); // Redirige al menú (ajusta la ruta según tu configuración)
          }, 1000);

          // Aquí puedes redirigir o mostrar un mensaje de éxito
        },
        (error) => {
          console.error('Error al agregar el producto:', error);
          // Manejo de errores aquí
        }
      );
    } else {
      console.error('Formulario inválido o ID de producto no encontrado.');
      alert('Por favor llena todos los campos.');
    }
  }
}
