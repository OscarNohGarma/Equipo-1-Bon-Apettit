import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { MenuProduct } from '../../../core/models/menuProduct';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Aquí es donde debes incluirlo
  standalone: true,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  providers: [MenuService],
})
export class EditProductComponent implements OnInit {
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
      name: [''],
      price: [''],
      description: [''],
      category: [''],
      // Otros campos que tengas en MenuProduct
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id'); // Obtén el ID del producto de la URL
    if (this.productId) {
      this.loadProduct(this.productId); // Cargar el producto con el ID
    }
  }

  loadProduct(id: string) {
    // Usar el método getMenuById que ya tienes en tu servicio
    this.menuService.getMenuById(id).subscribe((product: MenuProduct) => {
      this.product = product;
      // Rellenar el formulario con los datos del producto
      this.productForm.patchValue({
        name: product.name,
        price: product.price,
        description: product.image, // Dependiendo de los campos de tu modelo
        category: product.category,
      });
    });
  }

  saveProduct() {
    if (this.productForm.valid && this.productId) {
      const updatedProduct = { ...this.productForm.value, id: this.productId }; // Agregar el ID al objeto

      this.menuService.updateMenuItem(this.productId, updatedProduct).subscribe(
        (response) => {
          console.log('Producto actualizado exitosamente:', response);
          setTimeout(() => {
            alert('El producto se ha actualizado correctamente.'); // Muestra la alerta
            this.router.navigate(['/admin/menu']); // Redirige al menú (ajusta la ruta según tu configuración)
          }, 1000);

          // Aquí puedes redirigir o mostrar un mensaje de éxito
        },
        (error) => {
          console.error('Error al actualizar el producto:', error);
          // Manejo de errores aquí
        }
      );
    } else {
      console.error('Formulario inválido o ID de producto no encontrado.');
    }
  }
}
