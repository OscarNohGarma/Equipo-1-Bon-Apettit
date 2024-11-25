import { Component, OnInit } from '@angular/core';
import { ReservationTables } from '../../../core/models/reservationTables';
import { ReservationTablesService } from '../../../core/services/reservation-tables.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { error } from 'console';
import { UploadService } from '../../../core/services/upload.service';
declare var Swal: any;

@Component({
  selector: 'app-reservacion-table',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './reservacion-table.component.html',
  styleUrl: './reservacion-table.component.scss',
  providers: [ReservationTablesService, UploadService],
})
export class ReservacionTableComponent implements OnInit {
  reservation: ReservationTables[] = [];
  selectedStatus: string = 'En Espera';
  selectStatus: string = 'Confirmada';
  isDetailsOpen: boolean = false; //Controla la visualización del boton de detalle

  searchTerm: string = '';
  selectCategoryComprobante: string = 'TODOS';

  constructor(
    private reservationTablesServices: ReservationTablesService,
    private router: Router,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.loadReservation();
  }

  loadReservation() {
    // Obtiene las reservaciones desde el servicio
    this.reservationTablesServices.getAll().subscribe(
      (reservations: ReservationTables[]) => {
        this.reservation = reservations;

        // Formatea la fecha sin restar días
        this.reservation.forEach((res) => {
          if (res.fecha && /^\d{4}-\d{2}-\d{2}$/.test(res.fecha)) {
            // Verifica si es YYYY-MM-DD
            const dateParts = res.fecha.split('-'); // Separar el año, mes y día
            const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // DD/MM/YYYY
            res.fecha = formattedDate; // Asigna la fecha formateada
          }
        });
      },
      (error) => {
        Swal.fire('Upps..', `Error al cargar las reservaciones`, 'error');
      }
    );
  }

  setStatus(estados: string, reservation: ReservationTables) {
    this.selectedStatus = estados;
    reservation.estados = estados;
    const newReservation = {
      ...reservation,
      estados: this.selectedStatus,
    };
    this.reservationTablesServices
      .update(reservation.id.toString(), newReservation)
      .subscribe((response) => {}),
      (error: any) => {};
  }

  toggleDetails(reservation: ReservationTables): void {
    reservation.isDetailsOpen = !reservation.isDetailsOpen;
  }

  goToDetails(reservation: ReservationTables): void {
    this.router.navigate(['/detalle', reservation.id]);
  }

  confirmReservation(reservation: ReservationTables) {
    this.updateReservationStatus(reservation, 'Confirmada');
  }

  cancelReservation(reservation: ReservationTables) {
    this.updateReservationStatus(reservation, 'Cancelado');
  }

  releaseTable(reservation: ReservationTables) {
    this.updateReservationStatus(reservation, 'Liberado');
  }

  updateReservationStatus(reservation: ReservationTables, estado: string) {
    this.showConfirmPopup(
      `¿Deseas ${
        estado === 'Confirmada'
          ? 'confirmar'
          : estado === 'Cancelado'
          ? 'cancelar'
          : estado === 'Liberado'
          ? 'liberar'
          : ''
      } esta reservación?`,
      ''
    ).then((result: any) => {
      if (result.isConfirmed) {
        const updatedReservation = { ...reservation, estados: estado };
        this.reservationTablesServices
          .update(reservation.id.toString(), updatedReservation)
          .subscribe(
            () =>
              this.showPopup(
                'success',
                'Actualizado',
                'El estado de la reservación se ha actualizado.'
              ),
            (error) =>
              this.showPopup(
                'error',
                'Ocurrió un error',
                'No se pudo actualizar el estado.'
              )
          );
        reservation.estados = estado;
      }
    });
  }

  isFinalState(estado: string): boolean {
    return (
      estado === 'Confirmada' || estado === 'Cancelado' || estado === 'Liberado'
    );
  }

  updateSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
  }

  // Propiedad para filtrar las reservaciones combinando todos los filtros
  get filteredReservation(): ReservationTables[] {
    return this.reservation.filter((reservation) => {
      const matchesSearch = reservation.namee
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());

      const matchesComprobante =
        this.selectCategoryComprobante === 'TODOS' ||
        (this.selectCategoryComprobante === 'Comprobante' &&
          reservation.total !== '') ||
        (this.selectCategoryComprobante === 'Sin Comprobante' &&
          reservation.total === '');

      const matchesEstado =
        this.selectedStatus === '' ||
        reservation.estados === this.selectedStatus;

      return matchesSearch && matchesComprobante && matchesEstado;
    });
  }

  // Actualiza la categoría de comprobante (Con/Sin Comprobante)
  updateCategoryComprobante(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectCategoryComprobante = selectElement.value;
  }

  // Actualiza el estado de la reservación (En Espera, Liberado, etc.)
  updateEstados(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedStatus = selectElement.value;
  }

  getFileNameFromUrl(url: string): string | null {
    // Usar una expresión regular para extraer el nombre del archivo completo (ID + extensión)
    const match = url.match(/\/([^\/]+\.[a-zA-Z]+)$/);

    // Retornar el nombre del archivo si se encuentra, de lo contrario retornar null
    return match ? match[1] : null;
  }

  deleteReservation(id: number, image: string) {
    this.showConfirmDeletePopup(
      '¿Deseas Eliminar Esta Reservación?',
      'Esta Acción Es Irreversible, La Reservación Se Eliminará Permanentemente.'
    ).then((result: any) => {
      if (result.isConfirmed) {
        // Elimina la imagen si existe
        this.uploadService
          .deleteImage(this.getFileNameFromUrl(image)!)
          .subscribe(
            (response) => {
              // Acción después de eliminar la imagen, si es necesario
            },
            (error) => {
              console.error('Error al eliminar la imagen:', error);
            }
          );

        // Elimina la reservación
        this.reservationTablesServices.delete(id.toString()).subscribe(
          (response) => {
            setTimeout(() => {
              this.showPopup(
                'success',
                '¡Reservación Eliminada!',
                'La Reservación Cancelada, Fue Eliminada Exitosamente.'
              ).then(() => {
                this.loadReservation(); // Recarga las reservaciones
              });
            }, 100);
          },
          (error) => {
            this.showPopup(
              'error',
              'Upps... Ocurrió Un Problema',
              'Error Al Intentar Eliminar La Reservación.'
            );
          }
        );
      }
    });
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
  //CONFIRM POPUP
  showConfirmDeletePopup(title: string, text: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
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
    });
  }
  showConfirmPopup(title: string, text: string) {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false, // Desactivar estilos predeterminados de SweetAlert2
      didOpen: () => {
        // Aplicar estilos directamente
        const confirmButton = Swal.getConfirmButton();
        const cancelButton = Swal.getCancelButton();

        if (confirmButton) {
          confirmButton.style.backgroundColor = '#343a40';
          confirmButton.style.color = '#fff';
          confirmButton.style.padding = '10px 20px';
          confirmButton.style.fontWeight = 'bold';
          confirmButton.style.border = 'none';
          confirmButton.style.border = '2px solid #343a40';
          confirmButton.style.borderRadius = '5px';
          confirmButton.style.transition = 'background-color 0.3s ease'; // Agregar transición
          confirmButton.style.marginRight = '10px'; // Agregar transición

          confirmButton.onmouseover = () => {
            confirmButton.style.backgroundColor = '#24272b'; // Color en hover
          };
          confirmButton.onmouseout = () => {
            confirmButton.style.backgroundColor = '#343a40'; // Color normal
          };
        }

        if (cancelButton) {
          cancelButton.style.backgroundColor = '#fff';
          cancelButton.style.color = '#dc3545';
          cancelButton.style.padding = '10px 20px';
          cancelButton.style.fontWeight = 'bold';
          cancelButton.style.border = 'none';
          cancelButton.style.border = '2px solid #dc3545';
          cancelButton.style.borderRadius = '5px';
          cancelButton.style.transition = 'background-color 0.3s ease'; // Agregar transición
          cancelButton.style.marginRight = '10px'; // Agregar transición

          cancelButton.onmouseover = () => {
            cancelButton.style.backgroundColor = '#dc3545'; // Color en hover
            cancelButton.style.color = '#fff';
          };
          cancelButton.onmouseout = () => {
            cancelButton.style.backgroundColor = '#fff'; // Color normal
            cancelButton.style.color = '#dc3545';
          };
        }
      },
    });
  }
}
