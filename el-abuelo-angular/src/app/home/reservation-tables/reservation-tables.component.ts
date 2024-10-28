import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Directive,HostListener } from '@angular/core';
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
  imports: [CommonModule, FormsModule],
  templateUrl: './reservation-tables.component.html',
  styleUrls: ['./reservation-tables.component.scss']
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

  private costoPorMesa: number = 300; // Costo base por mesa
  public TipoBancaria: string = "BBVA";
  public cuentaBancaria: string = "4152 3143 1423 8885";
  public active: number = 1;
  private steps: NodeListOf<Element> | null = null;
  private formSteps: NodeListOf<FormStep> | null = null;
  // Agregar una propiedad para los tipos de archivo permitidos
  private allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];

  // Totales por separado para cada ubicación
  selectedSeatsCountInterior: number = 0;
  selectedSeatsCountExterior: number = 0;
  totalCostInterior: number = 300;
  totalCostExterior: number = 300;
  numeroTelefonico:string = "996 105 9860";
  // Precio por mesa
  readonly seatPrice: number = 300;
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
      '2Personas': 2, // 2 mesas de 2 personas
      '4Personas': 2, // 2 mesas de 4 personas
      '6Personas': 4  // 4 mesas de 6 personas
    },
    exterior: {
      '2Personas': 1, // si hay mesas de 2 personas en exterior
      '4Personas': 8, // 8 mesas de 4 personas
      '6Personas': 2  // 2 mesas de 6 personas
    }
  };

  cantidadMesasDisponibles: number = 0;
  selectedCapacity: string = '';
  private calcularTotalMesas(): void {
    let total = 0;

    // Sumar todas las mesas del interior
    Object.values(this.tableInventory.interior).forEach(cantidad => {
      total += cantidad;
    });

    // Sumar todas las mesas del exterior
    Object.values(this.tableInventory.exterior).forEach(cantidad => {
      total += cantidad;
    });

    this.cantidadMesasDisponibles = total;
  }
    // Agregar propiedades para controlar la visualización de las imágenes
    mostrarPreviewInterior: boolean = false;
    mostrarPreviewExterior: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object)  {
    // Establecer fecha mínima como hoy
    this.fechaMinima = this.formatDate(new Date());

    // Establecer fecha máxima como 6 meses desde hoy
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    this.fechaMaxima = this.formatDate(maxDate);
    this.calcularTotalMesas(); // Inicializar con el total de mesas
  }

  ngOnInit(): void {
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
    this.isTableForTwo = this.cantidadPersonas === '2Personas';

    // Update available decorations based on table size
    this.updateDecoracionesDisponibles();

    switch(this.cantidadPersonas) {
      case '2Personas':
        this.mostrarExterior = true; // Changed to true to allow exterior selection for 2 people
        this.updateAvailableTables('Interior');
        break;
      case '4Personas':
      case '6Personas':
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
        this.cantidadMesasDisponibles = this.tableInventory.interior[this.selectedCapacity] +
                                       this.tableInventory.exterior[this.selectedCapacity];
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



  //Apartir de aqui es del formulario

  // Formatea la fecha al formato requerido por el input type="date"
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Validar la fecha seleccionada
  validarFecha(): void {
    if (this.fechaReservada) {
      // Crear fecha con la zona horaria local
      const fecha = new Date(this.fechaReservada + 'T00:00:00');
      const dia = fecha.getDay(); // 0: domingo, 1: lunes, ..., 6: sábado

      // Validar que sea de viernes a domingo (5-6, 0)
      this.fechaInvalida = dia === 1 || dia === 2 || dia === 3 || dia === 4; // Es inválido solo si es lunes a jueves

      // Si la fecha es inválida, limpiar el horario
      if (this.fechaInvalida) {
        this.horarioReservado = '';
        this.horarioInvalido = false;
      }

      // Verificar si la fecha es anterior a hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // Comparar solo las fechas sin la hora
      const fechaStr = fecha.toISOString().split('T')[0];
      const hoyStr = hoy.toISOString().split('T')[0];

      if (fechaStr < hoyStr) {
        this.fechaInvalida = true;
        this.fechaReservada = this.fechaMinima;
      }
    }
  }


  // Validar el horario seleccionado
  validarHorario(): void {
    if (this.horarioReservado) {
      const [horas, minutos] = this.horarioReservado.split(':').map(Number);

      // Verificar si el horario está fuera del rango permitido (7:00 PM - 12:00 AM)
      this.horarioInvalido = horas < 19 || horas >= 24;

      if (this.horarioInvalido) {
        // Si el horario es inválido, establecerlo al horario mínimo permitido
        this.horarioReservado = '19:00';
      }
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

    this.calcularCosto();
    this.updateButtonVisibility();
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

    // Calcular el costo total
    const costoTotal = cantidad * this.costoPorMesa;
    // Calcular el costo total con decoración
    this.costoConDecoracion = cantidad * (this.costoPorMesa + costoDecoracion);
    const costoTotalConDecoracion = costoTotal + costoDecoracion;
    this.costoMesa.nativeElement.value = costoTotal.toString();
    this.costoConDecoracion = costoTotalConDecoracion;

     // Actualizar el mensaje dependiendo de si hay decoración o no
     if (this.decoracionSeleccionada === 'Ninguna' || !this.decoracionSeleccionada) {
      this.mensajeTotalPago = `Total sin decoración: $${costoTotal} MXN`;
    } else {
      this.mensajeTotalPago = `Total con decoración (${this.decoracionSeleccionada}): $${this.costoConDecoracion} MXN`;
    }

    // Actualizar el valor del input del costo con decoración
    this.costoConDecoracion = costoTotalConDecoracion;

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

  private procesarReservaDirecta(): void {
    if (this.validateFormOne() && this.validateFormTwo()) {
      Swal.fire({
        icon: 'success',
        title: '¡Reservación Exitosa!',
        text: 'Su reservación ha sido procesada correctamente.',
        confirmButtonText: 'Aceptar'
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.active = 4;
          this.showReservarOtraMesa = true;
          this.updateProgress();
        }
      });
    }
  }

  reservarMesa(): void {
    if (this.active === 2 && (this.decoracionSeleccionada === 'Ninguna' || this.decoracionSeleccionada === 'Personalizado')) {
      this.procesarReservaDirecta();
    } else if (this.active === 3) {
      if (!this.validateFormThree()) {
        return;
      }
      Swal.fire({
        icon: 'success',
        title: '¡Reservación Exitosa!',
        text: 'Su reservación ha sido procesada correctamente.',
        confirmButtonText: 'Aceptar'
      }).then((result: any) => {
        if (result.isConfirmed) {
          this.active = 4;
          this.showReservarOtraMesa = true;
          this.updateProgress();
        }
      });
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
          confirmButtonText: 'Entendido'
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
          confirmButtonText: 'Entendido'
        });
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
        confirmButtonText: 'Entendido'
      });
      return false;
    }
    return true;
  }


  private handleNext(): void {
    let isValid = true;

    switch (this.active) {
      case 1:
        isValid = this.validateFormOne();
        break;
      case 2:
        isValid = this.validateFormTwo();
        if (isValid && (this.decoracionSeleccionada === 'Ninguna' || this.decoracionSeleccionada === 'Personalizado')) {
          this.procesarReservaDirecta();
          return;
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

  private handleFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && this.imagePreview) {
      // Validar el tipo de archivo
      if (!this.allowedFileTypes.includes(file.type.toLowerCase())) {
        Swal.fire({
          icon: 'error',
          title: 'Tipo de archivo no permitido',
          text: 'Por favor, seleccione una imagen en formato JPG, JPEG, PNG o HEIC.',
          confirmButtonText: 'Entendido'
        });
        this.resetFileInput(input);
        return;
      }

      // Validar el tamaño del archivo (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Archivo demasiado grande',
          text: 'Por favor, seleccione una imagen menor a 20MB.',
          confirmButtonText: 'Entendido'
        });
        this.resetFileInput(input);
        return;
      }

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
}
