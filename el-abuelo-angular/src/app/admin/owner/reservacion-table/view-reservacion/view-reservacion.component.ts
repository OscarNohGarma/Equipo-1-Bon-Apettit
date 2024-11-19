import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, formatDate, Location } from '@angular/common';
import { Observable } from 'rxjs';
import { UploadService } from '../../../../core/services/upload.service';
import { ReservationTables } from '../../../../core/models/reservationTables';
import { ReservationTablesService } from '../../../../core/services/reservation-tables.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from '../../../../core/models/usuario';
import { HttpClientModule } from '@angular/common/http';
declare var Swal: any;

@Component({
  selector: 'app-view-reservacion',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, HttpClientModule],
  templateUrl: './view-reservacion.component.html',
  styleUrl: './view-reservacion.component.scss',
  providers: [ReservationTablesService, UploadService],
})
export class ViewReservacionComponent implements OnInit {
  reservationForm: FormGroup;
  reservation: ReservationTables | null = null;
  reservationID: string | null = null;

  public message =
    'El precio será determinado por el consumo realizado en el local';
  imagePreviewUrl: string | null = null;
  expandedImage: string | null = null; // Controla la imagen expandida

  // Propiedades para almacenar los valores originales
  originalCantidadMesasReservada: string = '';
  originalCantidad: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reservationTablesService: ReservationTablesService,
    private uploadService: UploadService,
    private location: Location
  ) {
    this.reservationForm = this.fb.group({
      namee: [''],
      usuario: [''],
      telefono: [''],
      cantidadMesasReservada: [''],
      cantidad: [''],
      ubicacion: [''],
      costo: [''],
      tipo_decoracion: [''],
      fecha: [''],
      hora: [''],
      total: [''],
      numero_cuenta: [''],
      tipo_banco: [''],
      image: [''],
    });
  }

  ngOnInit(): void {
    this.reservationID = this.route.snapshot.paramMap.get('id');
    if (this.reservationID) {
      this.loadServation(this.reservationID);
    }
  }

  loadServation(id: string) {
    this.reservationTablesService
      .getById(id)
      .subscribe((reservation: ReservationTables) => {
        this.reservation = reservation;

        // Formatear la fecha si es válida y está en el formato esperado
        if (
          reservation.fecha &&
          /^\d{4}-\d{2}-\d{2}$/.test(reservation.fecha)
        ) {
          const dateParts = reservation.fecha.split('-'); // Separar el año, mes y día
          const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // DD/MM/YYYY
          reservation.fecha = formattedDate;
        }

        // Guardar los valores originales
        this.originalCantidadMesasReservada =
          reservation.cantidadMesasReservada;
        this.originalCantidad = reservation.cantidad;

        // Asignar valores formateados al formulario
        this.reservationForm.patchValue({
          usuario: reservation.usuario,
          namee: reservation.namee,
          telefono: reservation.telefono,
          cantidadMesasReservada: this.originalCantidadMesasReservada,
          cantidad: this.originalCantidad,
          ubicacion: reservation.ubicacion,
          costo: reservation.costo,
          tipo_decoracion: reservation.tipo_decoracion,
          fecha: reservation.fecha, // Fecha formateada
          hora: reservation.hora + ' pm',
          total: reservation.total,
          numero_cuenta: reservation.numero_cuenta,
          tipo_banco: reservation.tipo_banco,
        });
      });
  }

  openImage(imageUrl: string | null = null) {
    this.expandedImage = imageUrl;
  }

  closeImage() {
    this.expandedImage = null;
  }
  goBack() {
    this.location.back();
  }
}
