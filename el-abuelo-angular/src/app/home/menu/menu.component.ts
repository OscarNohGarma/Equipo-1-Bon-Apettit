import { Component, OnInit } from '@angular/core';
import { MenuProduct } from '../../core/models/menuProduct';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { OrdenComponent } from './orden/orden.component';
import { ProductService } from '../../core/services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, OrdenComponent, HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ProductService, AuthService],
})
export class MenuComponent implements OnInit {
  selectedCategory: string = 'TODOS'; // Categoría por defecto
  isMenuOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  showOrder: boolean = false; // Controla la visibilidad de la orden
  menuItems: MenuProduct[] = [];
  expandedImage: string | null = null; // Controla la imagen expandida
  currentUser: string | null = null; // Controla la imagen expandida

  constructor(
    private ordenService: OrderService,
    private productService: ProductService,
    private authService: AuthService,
    private router: Router
  ) {} // Inyectar el servicio

  ngOnInit(): void {
    this.currentUser = this.authService.getUser();

    this.loadMenu();
  }
  loadMenu(): void {
    this.productService.getAll().subscribe((data) => {
      this.menuItems = data;
    });
  }

  get filteredProducts(): MenuProduct[] {
    if (this.selectedCategory === 'TODOS') {
      return this.menuItems;
    }
    return this.menuItems.filter(
      (product) => product.categoria === this.selectedCategory
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
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
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
