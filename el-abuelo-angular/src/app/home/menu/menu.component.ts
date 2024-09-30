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
  // modelos: MenuProduct[] = [
  //   {
  //     name: 'Hamburguesa',
  //     image:
  //       'https://s3.abcstatics.com/media/gurmesevilla/2012/01/comida-rapida-casera.jpg',
  //     price: 80,
  //     category: 'COMIDA',
  //     id: 1,
  //   },
  //   {
  //     name: 'Frappé',
  //     image:
  //       'https://img.freepik.com/fotos-premium/cafe-frape-frio-tu-sed-ai-generation_724548-21265.jpg',
  //     price: 50,
  //     category: 'BEBIDAS',
  //     id: 2,
  //   },
  //   {
  //     name: 'Pastel de fresa',
  //     image: 'https://cdn7.kiwilimon.com/recetaimagen/16297/8238.jpg',
  //     price: 45,
  //     category: 'POSTRES',
  //     id: 3,
  //   },
  //   {
  //     name: 'Boneless',
  //     image:
  //       'https://editorialtelevisa.brightspotcdn.com/dims4/default/834bd21/2147483647/strip/true/crop/996x560+2+0/resize/1440x810!/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2020%2F04%2Fboneless-de-pollo-buffalo.jpg',
  //     price: 90,
  //     category: 'COMIDA',
  //     id: 4,
  //   },
  //   {
  //     name: 'Coca Cola',
  //     image:
  //       'https://www.coca-cola.com/content/dam/onexp/cl/es/brands/coca-cola/coca-cola-sin-az%C3%BAcar/es_coca-cola-sin-azucar_prod_750x750_v1.jpg',
  //     price: 25,
  //     category: 'BEBIDAS',
  //     id: 5,
  //   },
  //   {
  //     name: 'Pastel de chocolate',
  //     image:
  //       'https://lh3.googleusercontent.com/proxy/0c2tsMegE6WGDUFtmlmZG6BV25LvzMuDM8B4KMYeP3_9LWR6FGQGGx-aAAOMrTeyM0x37R_dd7AlXUdJMpjG6n0j9n5331Ay35ElkIA6N9ZNmW6z0ljeB2IJgfknWH_H',
  //     price: 50,
  //     category: 'POSTRES',
  //     id: 6,
  //   },
  // ];

  menuItems: MenuProduct[] = [];

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
}
