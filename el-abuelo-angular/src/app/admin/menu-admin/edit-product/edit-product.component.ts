import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

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
    private fb: FormBuilder
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
    if (this.productForm.valid) {
      const updatedProduct = { ...this.product, ...this.productForm.value };
      // Aquí agregas la lógica para actualizar el producto (ejemplo: llamada PUT)
      console.log('Producto actualizado:', updatedProduct);
    }
  }
}
