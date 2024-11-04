import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../core/services/order.service';
import { MenuProduct } from '../../../core/models/menuProduct';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderMenu } from '../../../core/models/orderMenu';
import { OrderMenuService } from '../../../core/services/order-menu.service';
import { AuthService } from '../../../auth/auth.service';
import { AddProductComponent } from '../../../admin/menu-admin/add-product/add-product.component';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
declare var Swal: any;

@Component({
  selector: 'app-orden',
  standalone: true,
  imports: [CommonModule, FormsModule, AddProductComponent, SpinnerComponent],
  templateUrl: './orden.component.html',
  styleUrls: ['./orden.component.scss'],
  providers: [OrderMenuService],
})
export class OrdenComponent implements OnInit {
  productosEnOrden: MenuProduct[] = [];
  isVisible = false; // Controla la visibilidad de la lista de productos
  buttonIsVisible = false; // Controla la visibilidad del botón para mostrar/ocultar la lista
  modalVisible = false; // Controla la visibilidad del modal
  currentUser: string = '';
  currentName: string = '';
  currentPhone: string = '';
  tipoEntrega: string = '';
  direccion: string = '';
  loading: boolean = false;

  constructor(
    public ordenService: OrderService,
    private router: Router,
    public ordenMenuService: OrderMenuService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.ordenService.productosEnOrden$.subscribe((productos) => {
      this.productosEnOrden = productos;
      this.isVisible = this.productosEnOrden.length > 0;
      this.buttonIsVisible = this.productosEnOrden.length > 0;
    });
    this.currentUser = this.authService.getUser()!;
    this.currentName = this.authService.getUsername()!;
    this.currentPhone = this.authService.getPhone()!;
    console.log(this.currentPhone);
  }

  toggleOrden() {
    this.isVisible = !this.isVisible;
  }

  get total(): number {
    return this.ordenService.getTotal();
  }

  incrementarCantidad(index: number) {
    this.ordenService.incrementarCantidad(index);
  }

  decrementarCantidad(index: number) {
    this.ordenService.decrementarCantidad(index);
  }

  confirmarPedido() {
    this.modalVisible = true; // Muestra el modal
  }

  cerrarModal() {
    this.modalVisible = false; // Oculta el modal
  }

  enviarPedido() {
    if (!this.tipoEntrega) {
      this.showPopup(
        'error',
        'Tipo en entrega requerido',
        'Por favor selecciona un tipo de entrega válido'
      );
      return;
    }
    if (this.tipoEntrega === 'domicilio' && !this.direccion) {
      this.showPopup(
        'error',
        'Dirección requerida',
        'Por favor ingresa la dirección de entrega'
      );
      return;
    }
    this.loading = true;
    // Lógica para enviar el pedido con el nombre del cliente

    // Obtener la fecha en formato YYYY-MM-DD
    const fechaActual = new Date();

    // Obtener la fecha en formato YYYY-MM-DD
    const fecha = fechaActual.toLocaleDateString('es-ES'); // Formato: 12/10/2024

    // Usar toLocaleString para obtener la hora en formato de 12 horas con a.m./p.m.
    const hora = fechaActual.toLocaleString('es-ES', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
    //CREAR EL OBJETO QUE SE ENVIARÁ AL SERVICIO DE LA ORDEN
    const newOrden = {
      id: 0,
      namee: this.currentName,
      user: this.currentUser,
      phone: this.currentPhone,
      total: this.total,
      productos: this.productosEnOrden,
      fecha, // Fecha separada
      hora, // Hora separada
      status: 'queue',
      tipoEntrega: this.tipoEntrega,
      ...(this.tipoEntrega === 'domicilio' && { direccion: this.direccion }),
    };
    //ENVIAR LA ORDEN SI TODO ESTÁ CORRECTO
    this.ordenMenuService.add(newOrden).subscribe(
      (response) => {
        // Muestra el SweetAlert y espera a que el usuario confirme antes de continuar
        this.loading = false;
        this.showPopup(
          'success',
          '¡Pedido Exitoso!',
          'El pedido se añadió correctamente.'
        ).then((result: any) => {
          if (result.isConfirmed) {
            this.cerrarModal();
            this.isVisible = false;
            setTimeout(() => {
              this.direccion = '';
              this.tipoEntrega = '';
              this.ordenService.eliminarTodosLosProductos();
              this.router.navigate(['/mis-ordenes']).then(() => {
                // Esperar a que la navegación esté completa antes de desplazar
                // window.scrollTo(0, 0); // Desplazarse al principio de la página
              });
            }, 500); // Ajusta el tiempo según lo necesites
          }
        });
      },
      (error) => {
        this.loading = false;
        this.showPopup(
          'error',
          'Ocurrió un problema.',
          'Error al añadir la orden.'
        );
      }
    );
  }
  //POPUP PERSONALIZABLE
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
