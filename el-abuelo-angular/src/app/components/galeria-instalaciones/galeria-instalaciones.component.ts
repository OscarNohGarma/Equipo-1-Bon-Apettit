import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-galeria-instalaciones',
  standalone: true,
  imports: [CommonModule],  // Añade CommonModule aquí
  templateUrl: './galeria-instalaciones.component.html',
  styleUrls: ['./galeria-instalaciones.component.scss']
})
export class GaleriaInstalacionesComponent {
  modelos = [
    {
      nombre: 'Parador Star',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, consequatur architecto. Ipsa'+
                    'ipsum dolore maxime dolorem doloribus molestiae corrupti eius a cum, eos illum expedita excepturi'+
                    'odit, quo asperiores distinctio!',
      imagen: '../../../assets/galeriaInstalaciones/PCentral.jpg',
      clase: 'basico'
    },
    {
      nombre: 'Parador Fotográfico',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, consequatur architecto. Ipsa'+
                    'ipsum dolore maxime dolorem doloribus molestiae corrupti eius a cum, eos illum expedita excepturi'+
                    'odit, quo asperiores distinctio!',
      imagen: '../../../assets/galeriaInstalaciones/PFotografico.jpg',
      clase: 'premier'
    },
    {
      nombre: 'Comedor Interno',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, consequatur architecto. Ipsa'+
                    'ipsum dolore maxime dolorem doloribus molestiae corrupti eius a cum, eos illum expedita excepturi'+
                    'odit, quo asperiores distinctio!',
      imagen: '../../../assets/galeriaInstalaciones/PComedor.jpg',
      clase: 'elite'
    },
    {
      nombre: 'Sala Parejas',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore, consequatur architecto. Ipsa'+
                    'ipsum dolore maxime dolorem doloribus molestiae corrupti eius a cum, eos illum expedita excepturi'+
                    'odit, quo asperiores distinctio!',
      imagen: '../../../assets/galeriaInstalaciones/Pprivado.jpg',
      clase: 'premier'
    },
  ];
}
