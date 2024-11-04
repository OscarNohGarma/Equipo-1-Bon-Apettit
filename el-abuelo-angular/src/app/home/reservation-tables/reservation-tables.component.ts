import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule,FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ReservationTables } from '../../core/models/reservationTables';
import { ReservationTablesService } from '../../core/services/reservation-tables.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../core/models/usuario';
import { UploadService } from '../../core/services/upload.service';
declare var Swal:any;
interface FormStep extends HTMLElement {
  classList: DOMTokenList;
}
interface TableInventory {
  interior: {
    [key: string]: number; // key will be '2Personas', '4Personas', '6Personas'
  };
  exterior: {
    [key: string]: number;
  };
}
@Component({
  selector: 'app-reservation-tables',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule,ReactiveFormsModule,],
  templateUrl: './reservation-tables.component.html',
  styleUrls: ['./reservation-tables.component.scss'],
  providers:[ReservationTablesService, AuthService, UsuarioService, UploadService],
})

export class ReservationTablesComponent implements OnInit {

  @ViewChild('nextButton') nextButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('prevButton') prevButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('fileUpload') fileUpload!: ElementRef<HTMLInputElement>;
  @ViewChild('imagePreview') imagePreview!: ElementRef<HTMLImageElement>;
  @ViewChild('cantidadMesas') cantidadMesas!: ElementRef<HTMLInputElement>;
  @ViewChild('costoMesa') costoMesa!: ElementRef<HTMLInputElement>;
  @ViewChild('container') containerRef!: ElementRef;
  @ViewChild('count') countRef!: ElementRef;
  @ViewChild('total') totalRef!: ElementRef;



  public costoPorMesa: number = 300; // Costo base por mesa
  public TipoBancaria: string = "BBVA";
  public cuentaBancaria: string = "4152 3143 1423 8885";
  public active: number = 1;
  private steps: NodeListOf<Element> | null = null;
  private formSteps: NodeListOf<FormStep> | null = null;
  // Agregar una propiedad para los tipos de archivo permitidos
  private allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
  // Totales por separado para cada ubicación
  totalCostInterior: number = 300;
  totalCostExterior: number = 300;
  numeroTelefonico:string = "996 105 9860";
  decoracionSeleccionadaInterior: string = 'Ninguna';
  decoracionSeleccionadaExterior: string = 'Ninguna';
  decoracionSeleccionada: string = ''; // Variable para la decoración seleccionada
  costoDecoraciones: { [key: string]: number } = { // Precios de decoraciones
    'Ninguna': 0,
    'Romantica':0,
    'Cumpleaños': 0,
    'Personalizado':0,
  };
  costoConDecoracion: number = this.costoPorMesa; // Precio inicial con decoración
  lugarSeleccionado: string = ''; // Variable para almacenar el lugar seleccionado
  personasSeleccionadas: boolean = false; // Nueva variable para saber si se seleccionaron personas
  cantidadPersonas: string = ''; // Variable para almacenar la cantidad de personas seleccionadas
  public mostrarExterior: boolean = true;
  fechaReservada: string = '';
  horarioReservado: string = '';
  fechaInvalida: boolean = false;
  horarioInvalido: boolean = false;
  fechaMinima: string;
  fechaMaxima: string;
  minDate: string | undefined;
  mensajeTotalPago: string = ''; // Para mostrar el mensaje en el form de métodos de pago
  cantidadMesasReservadas: number = 1; // Nueva variable para la cantidad de mesas reservadas
  showReservarOtraMesa: boolean = false; // Nueva variable para controlar la visibilidad del botón
  isTableForTwo: boolean = false;
  decoracionesDisponibles: string[] = ['Ninguna', 'Cumpleaños', 'Personalizado'];
  private tableInventory: TableInventory = {
    interior: {
      '2 Personas': 2, // 2 mesas de 2 personas
      '4 Personas': 2, // 2 mesas de 4 personas
      '6 Personas': 4  // 4 mesas de 6 personas
    },
    exterior: {
      '2 Personas': 1, // si hay mesas de 2 personas en exterior
      '4 Personas': 8, // 8 mesas de 4 personas
      '6 Personas': 2  // 2 mesas de 6 personas
    }
  };
  cantidadMesasDisponibles: number = 0;

  selectedCapacity: string = '';
 // Método para calcular el total de mesas disponibles después de actualizar el inventario
  private calcularTotalMesas(): void {
    let total = 0;
    Object.values(this.tableInventory.interior).forEach(cantidad => {
      total += cantidad;
    });
    Object.values(this.tableInventory.exterior).forEach(cantidad => {
      total += cantidad;
    });

    this.cantidadMesasDisponibles = total;

    // Si no hay mesas disponibles, mostrar una alerta
    if (this.cantidadMesasDisponibles <= 0) {
        Swal.fire({
          title: 'Lo sentimos',
          text: 'No hay mesas disponibles para reservar en este momento.',
          icon: 'error',
          didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              if (confirmButton) {
                  confirmButton.style.backgroundColor = '#343a40';
                  confirmButton.onmouseover = () => {
                      confirmButton.style.backgroundColor = '#212529';
                  };
                  confirmButton.onmouseout = () => {
                      confirmButton.style.backgroundColor = '#343a40';
                  };
              }
          }
      });
    }

  }
    // Agregar propiedades para controlar la visualización de las imágenes
  mostrarPreviewInterior: boolean = false;
  mostrarPreviewExterior: boolean = false;
  usuarioItems: Usuario[]=[];

  reservation: ReservationTables = new ReservationTables(0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'En Espera', '');
  currentUser: string | null = null; // Controla la imagen expandida
  currentName: string | null = null;
  currentPhone:string | null = null;
  imageUrl: string | null = null; // Añadir esta propiedad para almacenar la URL de la imagen
  selectedFile: File | null = null; // Archivo seleccionado para subir

  nameeVacio: boolean = false;
  telefonoVacio: boolean = false;
  cantidadVacio: boolean = false;
  ubicacionVacio: boolean = false;
  tipoDecoracionVacio: boolean = false;
  fechaVacia: boolean = false;
  horaVacia: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
      private reservationTables: ReservationTablesService,
      private router: Router,
      private authService: AuthService,
      private usuarioService: UsuarioService,
      private uploadService: UploadService,
      private fb: FormBuilder,
      private cdr: ChangeDetectorRef
  )  {



    // Establecer fecha mínima como hoy
    this.fechaMinima = this.formatDate(new Date());
    // Establecer fecha máxima como 6 meses desde hoy
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    this.fechaMaxima = this.formatDate(maxDate);
    this.calcularTotalMesas(); // Inicializar con el total de mesas
  }

  ngOnInit(): void {

    this.currentUser = this.authService.getUser();
    this.currentName = this.authService.getUsername() ?? '';
    this.reservation.namee = this.currentName;
    this.currentPhone = this.authService.getPhone() ?? '';
    this.reservation.telefono = this.currentPhone;


    this.reservationTables.getAll().subscribe((reservations) => {
      this.actualizarInventario(reservations);
      this.calcularTotalMesas(); // Calcula el total de mesas después de ajustar el inventario
    });

    if (isPlatformBrowser(this.platformId)) {
         // Configurar la fecha mínima (hoy)
        const hoy = new Date();
        this.minDate = hoy.toISOString().split('T')[0];
      setTimeout(() => {
        this.initializeElements();
        this.setupEventListeners();

      });

    }

    this.calcularTotalMesas();
    // Inicializar cantidad de mesas y costo en la carga inicial
    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }

  // Ahora usamos `ngAfterViewInit` para inicializar los valores de `cantidadMesas` y `costoMesa`
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.cantidadMesas) {
        this.cantidadMesas.nativeElement.value = '1';
      }
      this.calcularCosto();
    });
  }

  getColorStyle() {
    return {
      'color': this.cantidadMesasDisponibles === 0 ? 'red' : 'black',
      'font-weight': 'bold'
    };
  }

  private initializeElements(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.cantidadMesas && this.costoMesa) {
        this.cantidadMesas.nativeElement.addEventListener('input', () => this.calcularCosto());
        this.costoMesa.nativeElement.value = this.costoPorMesa.toString();
      }
      this.steps = document.querySelectorAll('.step');
      this.formSteps = document.querySelectorAll('.form-step');
      this.updateButtonVisibility();
    }
  }

  // Método para actualizar el inventario con base en las reservaciones actuales
  private actualizarInventario(reservations: any[]): void {
    // Resetear el inventario de mesas a los valores originales antes de restar
    this.tableInventory = {
      interior: { '2 Personas': 2, '4 Personas': 2, '6 Personas': 4 },
      exterior: { '2 Personas': 1, '4 Personas': 8, '6 Personas': 2 }
    };

    // Restar las mesas reservadas del inventario
    reservations.forEach(reservation => {
      const tipo = reservation.cantidad as '2 Personas' | '4 Personas' | '6 Personas';
      const ubicacion = reservation.ubicacion.toLowerCase() as 'interior' | 'exterior';

      // Asegurar que el tipo y la ubicación son válidos antes de restar
      if (this.tableInventory[ubicacion] && this.tableInventory[ubicacion][tipo] !== undefined) {
        this.tableInventory[ubicacion][tipo] -= 1;
      }
    });
  }


  checkEmpty(field: string): void {
    switch (field) {
      case 'namee':
        this.nameeVacio = !this.reservation.namee;
        break;
      case 'telefono':
        this.telefonoVacio = !this.reservation.telefono;
        break;
      case 'cantidad':
        this.cantidadVacio = !this.reservation.cantidad;
        break;
      case 'ubicacion':
        this.ubicacionVacio = !this.reservation.ubicacion;
        break;
      case 'tipo_decoracion':
        this.tipoDecoracionVacio = !this.reservation.tipo_decoracion;
        break;
      case 'fecha':
        this.fechaInvalida = !this.reservation.fecha;
        this.validarFecha();
        break;
      case 'hora':
        this.horaVacia = !this.reservation.hora;
        this.validarHorario();
        break;

    }
  }

  onInputChange(field: string): void {
    switch (field) {
      case 'namee':
        this.nameeVacio = false;
        break;
      case 'telefono':
        this.telefonoVacio = false;
        break;
      case 'cantidad':
        this.cantidadVacio = false;
        break;
      case 'ubicacion':
        this.ubicacionVacio = false;
        break;
      case 'tipo_decoracion':
        this.tipoDecoracionVacio = false;
        break;
      case 'fecha':
        this.fechaInvalida = false;
        this.fechaInvalida = false;
        break;
      case 'hora':
        this.horarioInvalido = false;
        this.horarioInvalido = false;
        break;
    }
  }


  private resetSelections(): void {
    this.lugarSeleccionado = '';
    this.decoracionSeleccionada = 'Ninguna';
    this.decoracionSeleccionadaInterior = 'Ninguna';
    this.decoracionSeleccionadaExterior = 'Ninguna';

    if (this.cantidadMesas) {
      this.cantidadMesas.nativeElement.value = 'Cantidad De Mesas A Reservar';
    }
    if (this.costoMesa) {
      this.costoMesa.nativeElement.value = '300';
    }
    this.mensajeTotalPago = '';
    this.selectedCapacity = '';
    // Agregar reset de los previews
    this.mostrarPreviewInterior = false;
    this.mostrarPreviewExterior = false;
    this.calcularTotalMesas(); // Mostrar el total de mesas al resetear
  }

  // Método para manejar el cambio en el selector de personas
  onPersonasChange(event: any) {
    this.resetSelections();

    if (!event.target.value || event.target.value === "") {
      this.calcularTotalMesas();
      return;
    }

    const previousPersonas = this.cantidadPersonas;
    this.cantidadPersonas = event.target.value;
    this.selectedCapacity = this.cantidadPersonas;
    this.personasSeleccionadas = true;
    // Check if selected option is for 2 people
    this.isTableForTwo = this.cantidadPersonas === '2 Personas';
    // Update available decorations based on table size
    this.updateDecoracionesDisponibles();

    switch(this.cantidadPersonas) {
      case '2 Personas':
        this.mostrarExterior = true; // Changed to true to allow exterior selection for 2 people
        this.updateAvailableTables('Interior');
        break;
      case '4 Personas':
      case '6 Personas':
        this.mostrarExterior = true;
        this.cantidadMesasDisponibles = this.tableInventory.interior[this.cantidadPersonas] +
                                       this.tableInventory.exterior[this.cantidadPersonas];
        break;
      default:
        this.mostrarExterior = true;
        this.calcularTotalMesas();
    }
    // Reset selections
    const lugarSelect = document.getElementById('Lugar') as HTMLSelectElement;
    const decoracionSelect = document.getElementById('decoracion') as HTMLSelectElement;
    if (lugarSelect) lugarSelect.value = '';
    if (decoracionSelect) decoracionSelect.value = 'Ninguna';
  }

  private updateDecoracionesDisponibles(): void {
    if (this.isTableForTwo) {
      this.decoracionesDisponibles = ['Ninguna', 'Romantica', 'Personalizado'];
    } else {
      this.decoracionesDisponibles = ['Ninguna', 'Cumpleaños', 'Personalizado'];
    }
  }

  // Método para manejar el cambio de lugar (interior o exterior)
  onLugarChange(event: any) {
    const decoracionSelect = document.getElementById('decoracion') as HTMLSelectElement;
    if (decoracionSelect) {
      decoracionSelect.value = 'Ninguna';
    }

    this.decoracionSeleccionada = 'Ninguna';
    this.decoracionSeleccionadaInterior = 'Ninguna';
    this.decoracionSeleccionadaExterior = 'Ninguna';
    // Resetear los previews
    this.mostrarPreviewInterior = false;
    this.mostrarPreviewExterior = false;

    if (!event.target.value || event.target.value === "") {
      if (this.selectedCapacity) {
        this.cantidadMesasDisponibles = this.tableInventory.interior[this.selectedCapacity] +  this.tableInventory.exterior[this.selectedCapacity];
      } else {
        this.calcularTotalMesas();
      }
      return;
    }

    this.lugarSeleccionado = event.target.value;
    this.updateAvailableTables(this.lugarSeleccionado);

    if (this.cantidadMesas) {
      this.cantidadMesas.nativeElement.value = '1';
      this.calcularCosto();
    }
  }

  private updateAvailableTables(location: string): void {
    if (!this.selectedCapacity) {
      this.calcularTotalMesas();
      return;
    }

    if (location === 'Interior') {
      this.cantidadMesasDisponibles = this.tableInventory.interior[this.selectedCapacity];
    } else if (location === 'Exterior') {
      this.cantidadMesasDisponibles = this.tableInventory.exterior[this.selectedCapacity];
    } else {
      this.cantidadMesasDisponibles = this.tableInventory.interior[this.selectedCapacity] +
                                     this.tableInventory.exterior[this.selectedCapacity];
    }
  }
  ///Apartir de aqui es del formulario . Formatea la fecha al formato requerido por el input type="date"
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Validar la fecha seleccionada
  validarFecha(): void {
    if (this.reservation.fecha) {
      // Crear fecha con la zona horaria local
      const fecha = new Date(this.reservation.fecha + 'T00:00:00');
      const dia = fecha.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado

      // Validar que sea de viernes a domingo (5-6, 0)
      this.fechaInvalida = dia === 1 || dia === 2 || dia === 3 || dia === 4;

      // Si la fecha es inválida, limpiar el horario
      if (this.fechaInvalida) {
        this.reservation.hora = '';
        this.horarioInvalido = false;
      }

      // Verificar si la fecha es anterior a hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fecha < hoy) {
        this.fechaInvalida = true;
        this.reservation.fecha = this.fechaMinima;
      }

      // Sincronizar con fechaReservada
      this.fechaReservada = this.reservation.fecha;
    }
  }


  // Validar el horario seleccionado
  validarHorario(): void {
    if (this.reservation.hora) {
      const [horas, minutos] = this.reservation.hora.split(':').map(Number);
      // Verificar si el horario está fuera del rango permitido (7:00 PM - 12:00 AM)
      this.horarioInvalido = horas < 19 || horas >= 24;

      if (this.horarioInvalido) {
        // Si el horario es inválido, establecerlo al horario mínimo permitido
        this.reservation.hora = '19:00';
      }

      // Sincronizar con horarioReservado
      this.horarioReservado = this.reservation.hora;
    }
  }


  // Método para deshabilitar días en el datepicker
  disableDates(): string[] {
    const disabledDates: string[] = [];
    const hoy = new Date();

    // Iterar sobre los próximos días para deshabilitar los lunes y martes
    for (let i = 0; i < 30; i++) {
      const nextDate = new Date(hoy);
      nextDate.setDate(hoy.getDate() + i);
      const dia = nextDate.getUTCDay(); // 0: domingo, 1: lunes, 2: martes, 3: miércoles, ...

      if (dia === 1 || dia === 2) { // Deshabilitar lunes (1) y martes (2)
        disabledDates.push(nextDate.toISOString().split('T')[0]);
      }
    }
    return disabledDates;
  }


  onDecoracionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.decoracionSeleccionada = selectElement.value;
    // Reset previews
    this.mostrarPreviewInterior = false;
    this.mostrarPreviewExterior = false;

    // Mostrar alertas específicas para "Ninguna" o "Personalizado"
    if (this.decoracionSeleccionada === 'Ninguna') {
      Swal.fire({
          title: 'Información',
          text: 'Se saltará el paso 3 Pagos. Métodos de pagos. Únicamente se cobrará lo que consuma en el local.',
          icon: 'info',
          confirmButtonText: 'Entendido',
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
  } else if (this.decoracionSeleccionada === 'Personalizado') {
      Swal.fire({
          title: 'Información',
          text: 'El costo y los detalles de la decoración se deben consultar directamente con el dueño del local.',
          icon: 'info',
          confirmButtonText: 'Entendido',
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

    if (this.decoracionSeleccionada === 'Romantica' && this.isTableForTwo) {
      if (this.lugarSeleccionado === 'Interior') {
        this.mostrarPreviewInterior = true;
        this.mostrarPreviewExterior = false;

      } else if (this.lugarSeleccionado === 'Exterior') {
        this.mostrarPreviewInterior = false;
        this.mostrarPreviewExterior = true;

      }
    }

    if (this.lugarSeleccionado === 'Interior') {
      this.decoracionSeleccionadaInterior = this.decoracionSeleccionada;

    } else if (this.lugarSeleccionado === 'Exterior') {
      this.decoracionSeleccionadaExterior = this.decoracionSeleccionada;


    }
    this.updateButtonVisibility();
    this.calcularCosto();
  }




  private calcularCosto(): void {
    const cantidad = parseInt(this.cantidadMesas.nativeElement.value, 10);
    const costoDecoracion = this.costoDecoraciones[this.decoracionSeleccionada] || 0;
    // Validar que la cantidad sea mayor o igual a 1
    if (isNaN(cantidad) || cantidad < 1) {
      this.cantidadMesas.nativeElement.value = '1';
      return;
    }

     // Actualizar la cantidad de mesas reservadas
    this.cantidadMesasReservadas = cantidad;
    this.reservation.cantidadMesasReservada = `${this.cantidadMesasReservadas} Mesa`
    // Calcular el costo total
    const costoTotal = cantidad * this.costoPorMesa;
    this.reservation.costo = `$${this.costoPorMesa} MXN`;
    // Calcular el costo total con decoración
    this.costoConDecoracion = cantidad * (this.costoPorMesa + costoDecoracion);
    const costoTotalConDecoracion = costoTotal + costoDecoracion;

    this.costoConDecoracion = costoTotalConDecoracion;

     // Actualizar el mensaje dependiendo de si hay decoración o no
     if (this.decoracionSeleccionada === 'Ninguna' || !this.decoracionSeleccionada) {
      this.mensajeTotalPago = `Total sin decoración: $${costoTotal} MXN`;
      this.reservation.total = this.mensajeTotalPago; // Asigna el valor calculado
    } else {
      this.mensajeTotalPago = `Total con decoración (${this.decoracionSeleccionada}): $${this.costoConDecoracion} MXN`;
      this.reservation.total = this.mensajeTotalPago; // Asigna el valor calculado
    }
    // Actualizar el valor del input del costo con decoración
    this.costoConDecoracion = costoTotalConDecoracion;
    this.reservation.numero_contacto = this.numeroTelefonico;
    this.reservation.tipo_banco = this.TipoBancaria;
    this.reservation.numero_cuenta = this.cuentaBancaria;
  }

  private updateButtonVisibility(): void {
    const nextButton = document.querySelector('.btn-next') as HTMLButtonElement;
    const submitButton = document.querySelector('.btn-submit') as HTMLButtonElement;

    if (nextButton && submitButton) {
      // En form-three (active === 3), ocultar siguiente y mostrar reservar
      if (this.active === 3) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'block';
      } else if (this.active === 2 && (this.decoracionSeleccionada === 'Ninguna' || this.decoracionSeleccionada === 'Personalizado')) {
        // En form-two con decoración Ninguna o Personalizado
        nextButton.style.display = 'none';
        submitButton.style.display = 'block';
      } else {
        // En otros casos
        nextButton.style.display = 'block';
        submitButton.style.display = 'none';
      }
    }
  }


  procesarReservaDirecta(): void {
    this.reservation.usuario = this.currentUser ?? '';

    // Verificar la disponibilidad de mesas
    const tipo = this.reservation.cantidad as '2 Personas' | '4 Personas' | '6 Personas';
    const ubicacion = this.reservation.ubicacion.toLowerCase() as 'interior' | 'exterior';

    if (this.tableInventory[ubicacion][tipo] <= 0) {
        Swal.fire({
          title: 'Lo sentimos',
          text: `No hay mesas disponibles para ${tipo} en el ${ubicacion}.`,
          icon: 'error',
          didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              if (confirmButton) {
                  confirmButton.style.backgroundColor = '#343a40';
                  confirmButton.onmouseover = () => {
                      confirmButton.style.backgroundColor = '#212529';
                  };
                  confirmButton.onmouseout = () => {
                      confirmButton.style.backgroundColor = '#343a40';
                  };
              }
            }
        });
        return; // Salir de la función si no hay disponibilidad
    }

    if (this.validateFormOne() && this.validateFormTwo()) {
        if (this.reservation.tipo_decoracion === 'Ninguna' ||
          this.reservation.tipo_decoracion === 'Personalizado') {
          this.reservation.costo = '';
          this.reservation.total = '';
        }
        this.reservationTables.add(this.reservation).subscribe({
            next: (response) => {
                      Swal.fire({
                        title: '¡Reservación Exitosa!',
                        text: 'Su reservación ha sido procesada correctamente.',
                        icon: 'success',
                        didOpen: () => {
                            const confirmButton = Swal.getConfirmButton();
                            if (confirmButton) {
                                confirmButton.style.backgroundColor = '#343a40';
                                confirmButton.onmouseover = () => {
                                    confirmButton.style.backgroundColor = '#212529';
                                };
                                confirmButton.onmouseout = () => {
                                    confirmButton.style.backgroundColor = '#343a40';
                                };
                            }
                        }
                    }).then((result: any) => {
                        if (result.isConfirmed) {
                            this.active = 4;
                            this.showReservarOtraMesa = true;
                            this.updateProgress();
                        }
                    });
            },
            error: (error) => {
                  Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al procesar la reservación. Inténtelo de nuevo.',
                    icon: 'error',
                    didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        if (confirmButton) {
                            confirmButton.style.backgroundColor = '#343a40';
                            confirmButton.onmouseover = () => {
                                confirmButton.style.backgroundColor = '#212529';
                            };
                            confirmButton.onmouseout = () => {
                                confirmButton.style.backgroundColor = '#343a40';
                            };
                        }
                    }
                });
            },
        });
    }
  }

  private resetForm(): void {
    this.reservation = new ReservationTables(0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'En Espera', this.currentUser ?? '');
    this.showReservarOtraMesa = false;
    this.active = 1;
  }

  reservarMesa(): void {
    this.reservation.usuario = this.currentUser ?? '';
    if (this.active === 2 && (this.reservation.tipo_decoracion === 'Ninguna' || this.reservation.tipo_decoracion === 'Personalizado')) {
      // Limpiar costo y total si la decoración es Ninguna o Personalizado
      this.reservation.costo = '';
      this.reservation.total = '';
      this.procesarReservaDirecta();
    } else if (this.active === 3) {
      if (this.validateFormThree()) {
        this.onUpload().subscribe({
          next: () => {
            this.reservation.image = this.imageUrl ?? ''; // Asigna cadena vacía si imageUrl es null
            if (this.reservation.tipo_decoracion === 'Ninguna' ||
              this.reservation.tipo_decoracion === 'Personalizado') {
              this.reservation.costo = '';
              this.reservation.total = '';
            }
            this.reservationTables.add(this.reservation).subscribe({

              next: () => {
                Swal.fire('¡Reservación Exitosa!', 'Su reservación ha sido procesada correctamente.', 'success').then(() => {
                  this.reservationTables.getAll().subscribe((reservations) => {
                    this.actualizarInventario(reservations);
                    this.calcularTotalMesas();
                  });
                  this.active = 4;
                  this.showReservarOtraMesa = true;
                  this.updateProgress();
                });
              },
              error: () => {
                  Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al procesar la reservación. Inténtelo de nuevo.',
                    icon: 'error',
                    didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        if (confirmButton) {
                            confirmButton.style.backgroundColor = '#343a40';
                            confirmButton.onmouseover = () => {
                                confirmButton.style.backgroundColor = '#212529';
                            };
                            confirmButton.onmouseout = () => {
                                confirmButton.style.backgroundColor = '#343a40';
                            };
                        }
                    }
                });
              }
            });
          },
          error: () => {
                Swal.fire({
                  title: 'Error',
                  text: 'Error al subir la imagen. Inténtelo de nuevo.',
                  icon: 'error',
                  didOpen: () => {
                      const confirmButton = Swal.getConfirmButton();
                      if (confirmButton) {
                          confirmButton.style.backgroundColor = '#343a40';
                          confirmButton.onmouseover = () => {
                              confirmButton.style.backgroundColor = '#212529';
                          };
                          confirmButton.onmouseout = () => {
                              confirmButton.style.backgroundColor = '#343a40';
                          };
                      }
                  }
              });
          }
        });
      }
    }
  }

  reservarOtraMesa(): void {
    location.reload(); // Recarga la página para reiniciar los formularios
     // Resetea el formulario para reservar otra mesa
     this.active = 1;
     this.showReservarOtraMesa = false;  // Ocultar el botón al volver al primer paso
  }

  private setupEventListeners(): void {
    if (this.nextButton && this.prevButton) {
      this.nextButton.nativeElement.addEventListener('click', () => this.handleNext());
      this.prevButton.nativeElement.addEventListener('click', () => this.handlePrev());
    }

    if (this.fileUpload) {
      this.fileUpload.nativeElement.addEventListener('change', (event) => this.handleFileUpload(event));
    }
  }

  private validateFormOne(): boolean {
    const formOne = document.querySelector('.form-one') as HTMLElement;
    const requiredInputs = formOne.querySelectorAll('input[required], select[required]');

    for (const input of Array.from(requiredInputs)) {
      const inputElement = input as HTMLInputElement | HTMLSelectElement;
      if (!inputElement.value) {
        Swal.fire({
          icon: 'error',
          title: 'Campos incompletos',
          text: 'Por favor complete todos los campos requeridos en la información del cliente.',
          confirmButtonText: 'Entendido',
          didOpen: () => {
            const confirmButton = Swal.getConfirmButton();
            if (confirmButton) {
                confirmButton.style.backgroundColor = '#343a40';
                confirmButton.onmouseover = () => {
                    confirmButton.style.backgroundColor = '#212529';
                };
                confirmButton.onmouseout = () => {
                    confirmButton.style.backgroundColor = '#343a40';
                };
            }
          }
        });
        return false;
      }
    }
    return true;
  }

  private validateFormTwo(): boolean {
    const formTwo = document.querySelector('.form-two') as HTMLElement;
    const requiredInputs = formTwo.querySelectorAll('input[required], select[required]');

    for (const input of Array.from(requiredInputs)) {
      const inputElement = input as HTMLInputElement | HTMLSelectElement;
      if (!inputElement.value) {
        Swal.fire({
          icon: 'error',
          title: 'Campos incompletos',
          text: 'Por favor complete todos los campos requeridos en la reservación de mesa.',
          confirmButtonText: 'Entendido',
          didOpen: () => {
            const confirmButton = Swal.getConfirmButton();
            if (confirmButton) {
                confirmButton.style.backgroundColor = '#343a40';
                confirmButton.onmouseover = () => {
                    confirmButton.style.backgroundColor = '#212529';
                };
                confirmButton.onmouseout = () => {
                    confirmButton.style.backgroundColor = '#343a40';
                };
            }
          }
        });
        /* console.log(inputElement) */
        return false;
      }
    }

    // Validaciones específicas para form-two
    if (this.fechaInvalida) {
      Swal.fire({
        icon: 'error',
        title: 'Fecha inválida',
        text: 'Solo se permiten fechas de miércoles a domingo.',
        confirmButtonText: 'Entendido'
      });
      return false;
    }

    if (this.horarioInvalido) {
      Swal.fire({
        icon: 'error',
        title: 'Horario inválido',
        text: 'El horario debe ser de 7:00 p.m. a 12:00 a.m.',
        confirmButtonText: 'Entendido'
      });
      return false;
    }
    return true;
  }

  private validateFormThree(): boolean {
    const formThree = document.querySelector('.form-three') as HTMLElement;
    const fileInput = this.fileUpload?.nativeElement;

    if (!fileInput?.files?.length) {
      Swal.fire({
        icon: 'error',
        title: 'Comprobante faltante',
        text: 'Por favor suba el comprobante de pago.',
        confirmButtonText: 'Entendido',
        didOpen: () => {
          const confirmButton = Swal.getConfirmButton();
          if (confirmButton) {
              confirmButton.style.backgroundColor = '#343a40';
              confirmButton.onmouseover = () => {
                  confirmButton.style.backgroundColor = '#212529';
              };
              confirmButton.onmouseout = () => {
                  confirmButton.style.backgroundColor = '#343a40';
              };
          }
        }
      });
      return false;
    }
    return true;
  }

  private handleNext(): void {
    this.currentUser = this.authService.getUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    } else {
      let isValid = true;

      switch (this.active) {
        case 1:
          isValid = this.validateFormOne(); // Mantener la validación original con su Swal
          if (isValid) {
            // Solo si es válido, limpiar estados
            this.onInputChange('namee');
            this.onInputChange('telefono');
          } else {
            // Si no es válido, marcar campos vacíos
            this.checkEmpty('namee');
            this.checkEmpty('telefono');
          }
          break;

        case 2:
          isValid = this.validateFormTwo(); // Mantener la validación original con su Swal

          if (isValid) {
            const tipo = this.reservation.cantidad as '2 Personas' | '4 Personas' | '6 Personas';
            const ubicacion = this.reservation.ubicacion.toLowerCase() as 'interior' | 'exterior';

            if (this.tableInventory[ubicacion][tipo] <= 0) {
                  Swal.fire({
                    title: 'Lo sentimos',
                    text: `No hay mesas disponibles para ${tipo} en el ${ubicacion}.`,
                    icon: 'error',
                    didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        if (confirmButton) {
                            confirmButton.style.backgroundColor = '#343a40';
                            confirmButton.onmouseover = () => {
                                confirmButton.style.backgroundColor = '#212529';
                            };
                            confirmButton.onmouseout = () => {
                                confirmButton.style.backgroundColor = '#343a40';
                            };
                        }
                    }
                });
              return;
            }

            // Solo si es válido, limpiar estados
            this.onInputChange('cantidad');
            this.onInputChange('ubicacion');
            this.onInputChange('tipo_decoracion');
            this.onInputChange('fecha');
            this.onInputChange('hora');

            if (this.decoracionSeleccionada === 'Ninguna' || this.decoracionSeleccionada === 'Personalizado') {
              this.procesarReservaDirecta();
              return;
            }
          } else {
            // Si no es válido, marcar campos vacíos
            this.checkEmpty('cantidad');
            this.checkEmpty('ubicacion');
            this.checkEmpty('tipo_decoracion');
            this.checkEmpty('fecha');
            this.checkEmpty('hora');
          }
          break;
      }

      if (isValid) {
        this.active++;
        this.updateProgress();
        this.updateButtonVisibility();
        if (this.active === 4) {
          this.showReservarOtraMesa = true;
        } else {
          this.showReservarOtraMesa = false;
        }
      }
    }
  }


  private handlePrev(): void {
    this.active--;
    if (this.active < 1) {
      this.active = 1;
    }
    this.updateProgress();
    this.updateButtonVisibility();
  }

  private updateProgress(): void {
    if (!this.steps || !this.formSteps) return;

    this.steps.forEach((step, i) => {
      if (i === (this.active - 1)) {
        step.classList.add('active');
        this.formSteps![i].classList.add('active');
      } else {
        step.classList.remove('active');
        this.formSteps![i].classList.remove('active');
      }
    });

    if (this.nextButton && this.prevButton) {
      if (this.active === 1) {
        this.prevButton.nativeElement.disabled = true;
      } else if (this.active === this.steps.length) {
        this.nextButton.nativeElement.disabled = true;
      } else {
        this.prevButton.nativeElement.disabled = false;
        this.nextButton.nativeElement.disabled = false;
      }
    }
  }

  generateUniqueId(): string {
    return Math.random().toString(36).substr(2, 9);
  }



  public handleFileUpload(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file && this.imagePreview) {
    if (!this.allowedFileTypes.includes(file.type.toLowerCase())) {
        Swal.fire({
          title: 'Error',
          text: 'Tipo de archivo no permitido. Por favor, seleccione una imagen en formato JPG, JPEG, PNG o HEIC.',
          icon: 'error',
          didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              if (confirmButton) {
                  confirmButton.style.backgroundColor = '#343a40';
                  confirmButton.onmouseover = () => {
                      confirmButton.style.backgroundColor = '#212529';
                  };
                  confirmButton.onmouseout = () => {
                      confirmButton.style.backgroundColor = '#343a40';
                  };
              }
          }
      });
      this.resetFileInput(input);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
        Swal.fire({
          title: 'Error',
          text: 'Archivo demasiado grande. Seleccione una imagen menor a 20MB.',
          icon: 'error',
          didOpen: () => {
              const confirmButton = Swal.getConfirmButton();
              if (confirmButton) {
                  confirmButton.style.backgroundColor = '#343a40';
                  confirmButton.onmouseover = () => {
                      confirmButton.style.backgroundColor = '#212529';
                  };
                  confirmButton.onmouseout = () => {
                      confirmButton.style.backgroundColor = '#343a40';
                  };
              }
          }
      });
      this.resetFileInput(input);
      return;
    }

    const newFileName = this.generateUniqueId() + '.png';
    this.selectedFile = new File([file], newFileName, { type: file.type });

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result && this.imagePreview) {
        this.imagePreview.nativeElement.src = e.target.result as string;
        this.imagePreview.nativeElement.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  } else if (this.imagePreview) {
    this.imagePreview.nativeElement.src = '';
    this.imagePreview.nativeElement.style.display = 'none';
  }
}

  private resetFileInput(input: HTMLInputElement): void {
    input.value = '';
    if (this.imagePreview) {
      this.imagePreview.nativeElement.src = '';
      this.imagePreview.nativeElement.style.display = 'none';
    }
  }

  onUpload(): Observable<void> {
    return new Observable((observer) => {
      if (this.selectedFile) {
        this.uploadService.uploadImage(this.selectedFile).subscribe({
          next: () => {
            const fileName = this.selectedFile!.name;
            let attempts = 0;
            const maxAttempts = 10;
            const retryInterval = 1000;

            const checkImage = () => {
              this.uploadService.getImage(fileName).subscribe({
                next: (imageResponse) => {
                  if (imageResponse && imageResponse.url) {
                    this.imageUrl = imageResponse.url;
                    observer.next();
                    observer.complete();
                  } else {
                    if (attempts < maxAttempts) {
                      attempts++;
                      setTimeout(checkImage, retryInterval);
                    } else {
                      observer.error('Error al obtener la imagen después de varios intentos.');
                    }
                  }
                },
                error: () => {
                  if (attempts < maxAttempts) {
                    attempts++;
                    setTimeout(checkImage, retryInterval);
                  } else {
                    observer.error('Error al obtener la imagen después de varios intentos.');
                  }
                }
              });
            };
            setTimeout(checkImage, retryInterval);
          },
          error: () => {
            observer.error('Error al subir la imagen.');
          }
        });
      } else {
        observer.error('No hay archivo seleccionado.');
      }
    });
  }
}
