import { Component, OnInit } from '@angular/core';
import { ReservationTables } from '../../core/models/reservationTables';
import { ReservationTablesService } from '../../core/services/reservation-tables.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.scss'
})
export class MyReservationsComponent implements OnInit {
  reservation : ReservationTables[] = [];
  currentUser: string = '';
  statusFilter: string = 'En Espera';

  isModalOpen = false;
  selectedImage: string | null = null;

  constructor(
    private reservationTablesService: ReservationTablesService,
    private authService: AuthService,
  ){



  }
  ngOnInit(): void {
    this.currentUser = this.authService.getUser()!;
    this.reservationTablesService.getAll().subscribe((reservation)=>{
      this.reservation = reservation.filter((reservation)=> reservation.usuario === this.currentUser).reverse();
      this.reservation.forEach(res => {
        if (res.fecha && /^\d{4}-\d{2}-\d{2}$/.test(res.fecha)) {  // Verifica si es YYYY-MM-DD
          const dateParts = res.fecha.split('-'); // Separar el año, mes y día
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // DD/MM/YYYY
          res.fecha = formattedDate; // Asigna la fecha formateada
        }
      });
    })
  }

  get filterReservation(): ReservationTables[] {
    return this.reservation.filter((reservation) => {
      return (
        this.statusFilter === 'TODO' ||
        reservation.estados === this.statusFilter ||
        (this.statusFilter === 'En Espera' && reservation.estados === 'En Espera')
      );
    });
  }


  updateStatusFilter(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.statusFilter = selectElement.value;
  }


    // Función para abrir el modal y asignar la imagen seleccionada
  openImageModal(imageUrl: string) {
      this.selectedImage = imageUrl;
      this.isModalOpen = true;
  }

    // Función para cerrar el modal
  closeImageModal() {
      this.isModalOpen = false;
      this.selectedImage = null;
  }

}
