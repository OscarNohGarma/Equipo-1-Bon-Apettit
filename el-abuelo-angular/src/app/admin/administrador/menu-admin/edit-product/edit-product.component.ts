import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { MenuProduct } from '../../../../core/models/menuProduct';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../../core/services/upload.service';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
declare var Swal: any;

@Component({
  selector: 'app-edit-product',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SpinnerComponent], // Aquí es donde debes incluirlo
  standalone: true,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  providers: [ProductService, UploadService],
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: string | null = null;
  product: MenuProduct | null = null;
  selectedFile: File | null = null;
  imageUrl: string | null = null; // Añadir esta propiedad para almacenar la URL de la imagen
  oldImageUrl: string | null = null; // Añadir esta propiedad para almacenar la URL vieja de la imagen
  isValidImage: boolean = true; // Agregar esta propiedad
  imagePreviewUrl: string | null = null; // Propiedad para la vista previa
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private uploadService: UploadService
  ) {
    this.productForm = this.fb.group({
      namee: [''],
      precio: ['', [Validators.min(1)]], // Precio mayor a 0
      image: [''],
      categoria: [''],
      stock: [false],
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
    this.productService.getById(id).subscribe((product: MenuProduct) => {
      this.product = product;
      // Rellenar el formulario con los datos del producto
      this.productForm.patchValue({
        namee: product.namee,
        precio: product.precio,
        image: product.image, // Dependiendo de los campos de tu modelo
        categoria: product.categoria,
        stock: product.stock,
      });
      this.imageUrl = product.image; // Suponiendo que product.image es la URL de la imagen
      this.oldImageUrl = product.image; // Suponiendo que product.image es la URL de la imagen
      this.imagePreviewUrl = this.imageUrl; // Establecer la vista previa
      console.log(this.oldImageUrl);
    });
  }
  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Tipos de imagen válidos

      if (validTypes.includes(file.type)) {
        const newFileName = this.generateUniqueId() + '.png';

        // Crear un nuevo archivo con el nombre modificado
        this.selectedFile = new File([file], newFileName, { type: file.type });
        this.isValidImage = true; // Archivo válido
        //! console.log('Archivo seleccionado:', this.selectedFile);

        // Generar vista previa de la imagen
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviewUrl = reader.result as string; // Almacenar la URL de la vista previa
        };
        reader.readAsDataURL(file); // Leer el archivo como una URL de datos
      } else {
        this.isValidImage = false; // Archivo no válido
        this,
          this.showPopup(
            'error',
            'Imagen no válida.',
            'Por favor, selecciona un archivo de imagen válido (JPEG, PNG, GIF, WEBP).'
          );
        input.value = ''; // Limpiar el input para que no retenga el archivo no válido
        this.imagePreviewUrl = null; // Reiniciar la vista previa
      }
    }
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.showPopup(
        'error',
        'Campos requeridos.',
        'Por favor llena todos los campos.'
      );
      return;
    }
    if (this.imagePreviewUrl === null) {
      this.showPopup(
        'error',
        'Imagen no válida.',
        'Por favor selecciona una imagen válida.'
      );
      return;
    }
    this.loading = true;
    if (this.productForm.valid && this.productId) {
      this.onUpload().subscribe(() => {
        const updatedProduct = {
          ...this.productForm.value,
          id: this.productId,
          image: this.imageUrl,
        }; // Agregar el ID al objeto

        this.productService.update(this.productId!, updatedProduct).subscribe(
          (response) => {
            //! console.log('Producto actualizado exitosamente:', response);
            if (this.selectedFile) {
              this.uploadService
                .deleteImage(this.getFileNameFromUrl(this.oldImageUrl!)!)
                .subscribe(
                  (response) => {
                    console.log('Imagen eliminada.');
                  },
                  (error) => {
                    console.error('Error al eliminar imagen:', error);
                  }
                );
            }
            this.loading = false;
            this.showPopup(
              'success',
              '¡Producto actualizado!',
              'El producto se actualizó correctamente.'
            ).then((result: any) => {
              this.router.navigate(['/admin/menu']);
            });
          },
          (error) => {
            this.loading = false;
            this.showPopup(
              'error',
              'Ocurrió un problema.',
              'Error al actualizar el producto.'
            );
          }
        );
      });
    }
  }
  onUpload() {
    return new Observable((observer) => {
      if (this.selectedFile) {
        this.uploadService.uploadImage(this.selectedFile).subscribe(
          (response) => {
            const fileName = this.selectedFile!.name;
            console.log('Subida exitosa:', fileName);

            // Lógica para reintentar el GET hasta 5 veces con un intervalo de 1 segundo
            let attempts = 0;
            const maxAttempts = 10;
            const retryInterval = 1000; // 1 segundo

            const checkImage = () => {
              this.uploadService.getImage(fileName).subscribe(
                (imageResponse) => {
                  if (imageResponse && imageResponse.url) {
                    console.log(this.oldImageUrl);
                    // this.uploadService
                    //   .deleteImage(this.getFileNameFromUrl(this.oldImageUrl!)!)
                    //   .subscribe(
                    //     (response) => {
                    //       console.log('Imagen eliminada.');
                    //     },
                    //     (error) => {
                    //       console.error('Error al eliminar imagen:', error);
                    //     }
                    //   );
                    this.imageUrl = imageResponse.url;
                    // console.log('Imagen obtenida:', this.imageUrl);

                    observer.next(); // Notificar que la operación fue exitosa
                    observer.complete(); // Completar el observable
                  } else {
                    if (attempts < maxAttempts) {
                      attempts++;
                      console.log(
                        `Reintentando obtener la imagen... (Intento ${attempts})`
                      );
                      setTimeout(checkImage, retryInterval); // Reintentar después de 1 segundo
                    } else {
                      console.error(
                        'Error: No se pudo obtener la imagen después de varios intentos.'
                      );
                      observer.error(
                        'Error al obtener la imagen después de varios intentos.'
                      );
                    }
                  }
                },
                (error) => {
                  console.error('Error al obtener la imagen', error);
                  if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkImage, retryInterval); // Reintentar después de 1 segundo
                  } else {
                    observer.error(
                      'Error al obtener la imagen después de varios intentos.'
                    );
                  }
                }
              );
            };

            // Iniciar el primer intento de obtener la imagen
            setTimeout(checkImage, retryInterval);
          },
          (error) => {
            this.showPopup(
              'error',
              'Ocurrió un problema.',
              'Error al subir la imagen.'
            );
            observer.error(error); // Notificar el error
          }
        );
      } else {
        // console.error('No hay archivo seleccionado.');
        // observer.error('No hay archivo seleccionado.');
        observer.next(); // Notificar que la operación fue exitosa
        observer.complete(); // Completar el observable
      }
    });
  }
  getFileNameFromUrl(url: string): string | null {
    // Usar una expresión regular para extraer el nombre del archivo completo (ID + extensión)
    const match = url.match(/\/([^\/]+\.[a-zA-Z]+)$/);

    // Retornar el nombre del archivo si se encuentra, de lo contrario retornar null
    return match ? match[1] : null;
  }
  //POPUP
  showPopup(icon: 'success' | 'error', title: string, text: string) {
    return Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: icon === 'success' ? 'Aceptar' : 'Entendido',
      didOpen: () => {
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
}
