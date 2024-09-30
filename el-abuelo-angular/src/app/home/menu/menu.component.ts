import { Component, OnInit } from '@angular/core';
import { MenuProduct } from '../../core/models/menuProduct';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { OrdenComponent } from './orden/orden.component';
import { MenuService } from '../../core/services/menu.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, OrdenComponent, HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [MenuService],
})
export class MenuComponent implements OnInit {
  selectedCategory: string = 'TODOS'; // Categoría por defecto
  isMenuOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  showOrder: boolean = false; // Controla la visibilidad de la orden
  menuItems: MenuProduct[] = [];
  expandedImage: string | null = null; // Controla la imagen expandida

  constructor(
    private ordenService: OrderService,
    private menuService: MenuService
  ) {} // Inyectar el servicio

  ngOnInit(): void {
    // this.http.get('http://localhost:3000/firebase/menu/getmenu').subscribe(
    //   (data) => {
    //     console.log(data);
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
    this.loadMenu();
  }
  loadMenu(): void {
    this.menuService.getMenu().subscribe((data) => {
      this.menuItems = data;
      console.log(this.menuItems);
    });
  }

  get filteredProducts(): MenuProduct[] {
    if (this.selectedCategory === 'TODOS') {
      return this.menuItems;
    }
    return this.menuItems.filter(
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

  // Función para abrir la imagen
  openImage(imageUrl: string) {
    this.expandedImage = imageUrl;
  }

  // Función para cerrar la imagen
  closeImage() {
    this.expandedImage = null;
  }
}
