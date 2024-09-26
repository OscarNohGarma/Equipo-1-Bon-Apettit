import { Component } from '@angular/core';
import { MenuProduct } from '../../core/models/menuProduct';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { OrdenComponent } from './orden/orden.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, OrdenComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  selectedCategory: string = 'TODOS'; // Categoría por defecto
  isMenuOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  showOrder: boolean = false; // Controla la visibilidad de la orden
  modelos: MenuProduct[] = [
    {
      name: 'Hamburguesa',
      image:
        'https://s3.abcstatics.com/media/gurmesevilla/2012/01/comida-rapida-casera.jpg',
      price: 80,
      category: 'COMIDA',
      id: 1,
    },
    {
      name: 'Frappé',
      image:
        'https://img.freepik.com/fotos-premium/cafe-frape-frio-tu-sed-ai-generation_724548-21265.jpg',
      price: 50,
      category: 'BEBIDAS',
      id: 2,
    },
    {
      name: 'Pastel de fresa',
      image: 'https://cdn7.kiwilimon.com/recetaimagen/16297/8238.jpg',
      price: 45,
      category: 'POSTRES',
      id: 3,
    },
  ];

  constructor(private ordenService: OrderService) {} // Inyectar el servicio

  get filteredProducts(): MenuProduct[] {
    if (this.selectedCategory === 'TODOS') {
      return this.modelos;
    }
    return this.modelos.filter(
      (product) => product.category === this.selectedCategory
    );
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.isMenuOpen = false; // Cierra el menú después de seleccionar una opción
  }

  agregarProducto(product: MenuProduct) {
    this.ordenService.agregarProducto(product); // Usar el servicio para agregar productos
    this.showOrder = true; // Muestra la orden cuando se añade un producto
  }
}
