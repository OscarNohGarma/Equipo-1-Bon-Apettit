import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-galeria-instalaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria-instalaciones.component.html',
  styleUrl: './galeria-instalaciones.component.scss'
})
export class GaleriaInstalacionesComponent  {
  modelos = [
    {
      nombre: 'Parador Star',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum odio vel dolor voluptates, asperiores quod'
            +'laudantium repellendus? Repudiandae exercitationem ex magni! Veritatis consectetur cupiditate,'+
            'voluptatems quae repellat perspiciatis assumenda explicabo.',
      imagen: '../../../assets/galeriaInstalaciones/PCentral.jpg',
      clase: 'basico'
    },
    {
      nombre: 'Parador Fotográfico',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum odio vel dolor voluptates, asperiores quod'
            +'laudantium repellendus? Repudiandae exercitationem ex magni! Veritatis consectetur cupiditate,'+
            'voluptatem quae repellat perspiciatis assumenda explicabo.',
      imagen: '../../../assets/galeriaInstalaciones/PFotografico.jpg',
      clase: 'premier'
    },
    {
      nombre: 'Comedor Interno',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum odio vel dolor voluptates, asperiores quod'
            +'laudantium repellendus? Repudiandae exercitationem ex magni! Veritatis consectetur cupiditate,'+
            'voluptatem quae repellat perspiciatis assumenda explicabo.',
      imagen: '../../../assets/galeriaInstalaciones/PComedor.jpg',
      clase: 'elite'
    },
    {
      nombre: 'Sala Parejas',
      descripcion: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum odio vel dolor voluptates, asperiores quod'
            +'laudantium repellendus? Repudiandae exercitationem ex magni! Veritatis consectetur cupiditate,'+
            'voluptatem quae repellat perspiciatis assumenda explicabo.',
      imagen: '../../../assets/galeriaInstalaciones/Pprivado.jpg',
      clase: 'premier'
    }
  ];
}
