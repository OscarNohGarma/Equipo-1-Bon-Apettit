import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { MenuProduct } from '../../core/models/menuProduct';
import { Router, RouterModule } from '@angular/router';
import { UploadService } from '../../core/services/upload.service';
declare var Swal: any;

@Component({
  selector: 'app-menu-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.scss',
  providers: [ProductService, UploadService],
})
export class MenuAdminComponent implements OnInit {
  selectedCategory: string = 'TODOS'; // Categoría por defecto
  isMenuOpen: boolean = false; // Para controlar la visibilidad del menú desplegable
  showOrder: boolean = false; // Controla la visibilidad de la orden
  menuItems: MenuProduct[] = [];
  expandedImage: string | null = null; // Controla la imagen expandida
  searchTerm: string = ''; // Término de búsqueda
  stockFilter: string = 'activo'; // Filtro de stock (activo/inactivo)

  constructor(
    private uploadService: UploadService,
    private productService: ProductService,
    private router: Router
  ) {} // Inyectar el servicio

  ngOnInit(): void {
    this.loadMenu();
  }
  loadMenu(): void {
    this.productService.getAll().subscribe((data) => {
      this.menuItems = data;
      // console.log(this.menuItems);
    });
  }

  get filteredProducts(): MenuProduct[] {
    return this.menuItems.filter((product) => {
      const matchesCategory =
        this.selectedCategory === 'TODOS' ||
        product.categoria === this.selectedCategory;
      const matchesSearch = product.namee
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesStock =
        this.stockFilter === '' ||
        (this.stockFilter === 'activo' && product.stock === true) ||
        (this.stockFilter === 'inactivo' && product.stock === false);

      return matchesCategory && matchesSearch && matchesStock;
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.isMenuOpen = false; // Cierra el menú después de seleccionar una opción
  }

  // Función para abrir la imagen
  openImage(imageUrl: string) {
    this.expandedImage = imageUrl;
  }

  // Función para cerrar la imagen
  closeImage() {
    this.expandedImage = null;
  }
  deleteProducto(id: number, image: string) {
    // Muestra un popup de confirmación con SweetAlert2
    Swal.fire({
      icon: 'warning',
      title: '¿Deseas eliminar este producto?',
      text: 'Esta acción eliminará el elemento del menú.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false, // Desactivar estilos predeterminados de SweetAlert2
      didOpen: () => {
        // Aplicar estilos directamente
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton) {
          confirmButton.style.backgroundColor = '#fff';
          confirmButton.style.color = '#dc3545';
          confirmButton.style.padding = '10px 20px';
          confirmButton.style.fontWeight = 'bold';
          confirmButton.style.border = 'none';
          confirmButton.style.border = '2px solid #dc3545';
          confirmButton.style.borderRadius = '5px';
          confirmButton.style.transition = 'background-color 0.3s ease'; // Agregar transición
          confirmButton.style.marginRight = '10px'; // Agregar transición

          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#dc3545'; // Color en hover
            confirmButton.style.color = '#fff';
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#fff'; // Color normal
            confirmButton.style.color = '#dc3545';
          };
        }

        if (cancelButton) {
          cancelButton.style.backgroundColor = '#343a40';
          cancelButton.style.color = '#fff';
          cancelButton.style.padding = '10px 20px';
          cancelButton.style.fontWeight = 'bold';
          cancelButton.style.border = 'none';
          cancelButton.style.border = '2px solid #343a40';
          cancelButton.style.borderRadius = '5px';
          cancelButton.style.transition = 'background-color 0.3s ease'; // Agregar transición

          cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = '#24272b'; // Color en hover
          };
          cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#343a40'; // Color normal
          };
        }
      },
    }).then((result: any) => {
      if (result.isConfirmed) {
        // El usuario confirmó la acción
        this.uploadService
          .deleteImage(this.getFileNameFromUrl(image)!)
          .subscribe(
            (response) => {
              console.log('Imagen eliminada.');
            },
            (error) => {
              console.error('Error al eliminar imagen:', error);
            }
          );

        this.productService.delete(id.toString()).subscribe(
          (response) => {
            // El producto fue eliminado exitosamente
            setTimeout(() => {
              Swal.fire({
                icon: 'success',
                title: '¡Producto eliminado!',
                text: 'El producto se eliminó correctamente.',
                confirmButtonText: 'Aceptar',
                didOpen: () => {
                  // Aplicar estilos directamente
                  const confirmButton = Swal.getConfirmButton();

                  if (confirmButton) {
                    confirmButton.style.backgroundColor = '#343a40';

                    confirmButton.onmouseover = () => {
                      confirmButton.style.backgroundColor = '#212529'; // Color en hover
                    };
                    confirmButton.onmouseout = () => {
                      confirmButton.style.backgroundColor = '#343a40'; // Color normal
                    };
                  }
                },
              }).then((result: any) => {
                this.loadMenu(); // Recargar el menú después de eliminar el producto
              });
            }, 100);
          },
          (error) => {
            // Ocurrió un error al eliminar el producto
            Swal.fire({
              icon: 'error',
              title: 'Ocurrió un problema.',
              text: 'Error al eliminar el producto.',
              confirmButtonText: 'Entendido',
              didOpen: () => {
                // Aplicar estilos directamente
                const confirmButton = Swal.getConfirmButton();

                if (confirmButton) {
                  confirmButton.style.backgroundColor = '#343a40';

                  confirmButton.onmouseover = () => {
                    confirmButton.style.backgroundColor = '#212529'; // Color en hover
                  };
                  confirmButton.onmouseout = () => {
                    confirmButton.style.backgroundColor = '#343a40'; // Color normal
                  };
                }
              },
            });
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  getFileNameFromUrl(url: string): string | null {
    // Usar una expresión regular para extraer el nombre del archivo completo (ID + extensión)
    const match = url.match(/\/([^\/]+\.[a-zA-Z]+)$/);

    // Retornar el nombre del archivo si se encuentra, de lo contrario retornar null
    return match ? match[1] : null;
  }
  // Método para actualizar la búsqueda
  updateSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
  }

  // Método para actualizar la categoría seleccionada
  updateCategory(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedCategory = selectElement.value;
  }

  // Método para actualizar el filtro de stock
  updateStock(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.stockFilter = selectElement.value;
  }
}
