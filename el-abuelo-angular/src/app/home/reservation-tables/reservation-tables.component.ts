import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Directive,HostListener } from '@angular/core';
declare var Swal:any;

interface FormStep extends HTMLElement {
  classList: DOMTokenList;
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
  private costoPorMesa: number = 120; // Costo base por mesa

  decoracionSeleccionada: string = ''; // Variable para la decoración seleccionada
  costoDecoraciones: { [key: string]: number } = { // Precios de decoraciones
    'Ninguna': 0,
    'Normal': 40,
    'San Valentin': 50,
    'Independencia': 60,
    'Parejas': 55,
    'Navideño': 70,
    'DiaDeMuerto': 65,
    'MomentoAmigos': 45,
    'Cumpleaños': 60,
    'Despedida': 75
  };
  costoConDecoracion: number = this.costoPorMesa; // Precio inicial con decoración

  lugarSeleccionado: string = ''; // Variable para almacenar el lugar seleccionado
  public active: number = 1;
  private steps: NodeListOf<Element> | null = null;
  private formSteps: NodeListOf<FormStep> | null = null;
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
  constructor(@Inject(PLATFORM_ID) private platformId: Object)  {
    // Establecer fecha mínima como hoy
    this.fechaMinima = this.formatDate(new Date());

    // Establecer fecha máxima como 6 meses desde hoy
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 6);
    this.fechaMaxima = this.formatDate(maxDate);
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
  }

/*   ngOnInit(): void {
     // Configurar la fecha mínima (hoy)
     const hoy = new Date();
     this.minDate = hoy.toISOString().split('T')[0];
    setTimeout(() => {
      this.initializeElements();
      this.setupEventListeners();
    });
  } */

  // Método para manejar el cambio de lugar (interior o exterior)
  onLugarChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.lugarSeleccionado = selectElement.value;
  }

  private initializeElements(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.cantidadMesas && this.costoMesa) {
        this.cantidadMesas.nativeElement.addEventListener('input', () => this.calcularCosto());
        this.costoMesa.nativeElement.value = this.costoPorMesa.toString();
      }

      this.steps = document.querySelectorAll('.step');
      this.formSteps = document.querySelectorAll('.form-step');
    }
  }

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

      // Validar que sea de miércoles a domingo (3-6, 0)
      this.fechaInvalida = dia === 1 || dia === 2; // Es inválido solo si es lunes o martes

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

  reservarMesa(): void {
    if (!this.validateFormThree()) {
      return; // Si la validación falla, no continuamos con la reserva
    }

    // Si la validación es exitosa, procedemos con la reserva
    Swal.fire({
      icon: 'success',
      title: '¡Reservación Exitosa!',
      text: 'Su reservación ha sido procesada correctamente.',
      confirmButtonText: 'Aceptar'
    }).then((result:any) => {
      if (result.isConfirmed) {
        this.active = 4;  // Cambia el valor de 'active' al paso 4
        this.showReservarOtraMesa = true; // Muestra el botón para reservar otra mesa
        this.updateProgress();  // Llama a la función para actualizar la interfaz
      }
    });
  }

  reservarOtraMesa(): void {
    location.reload(); // Recarga la página para reiniciar los formularios
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

    // Validar según el paso actual
    switch (this.active) {
      case 1:
        isValid = this.validateFormOne();
        break;
      case 2:
        isValid = this.validateFormTwo();
        break;
      case 3:
        isValid = this.validateFormThree();
        break;
    }

    // Solo avanzar si la validación es exitosa
    if (isValid) {
      this.active++;
      if (this.active > (this.steps?.length || 0)) {
        this.active = this.steps?.length || 0;
      }
      this.updateProgress();
    }
  }

  private handlePrev(): void {
    this.active--;
    if (this.active < 1) {
      this.active = 1;
    }
    this.updateProgress();
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
}
