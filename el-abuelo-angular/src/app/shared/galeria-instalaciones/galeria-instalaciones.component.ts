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
      descripcion: 'Un espacio acogedor para disfrutar de los mejores momentos del día. El Parador Star te ofrece una atmósfera cálida y relajante, perfecta para saborear tu café favorito o desconectarte con un buen libro. Descubre el encanto de este rincón donde el tiempo parece detenerse.',
      imagen: '../../../assets/galeriaInstalaciones/PCentral.jpg',
      clase: 'elite'
    },
    {
      nombre: 'Parador Fotográfico',
      descripcion: 'Captura recuerdos inolvidables en nuestro Parador Fotográfico, donde cada rincón está diseñado para enamorar a la cámara. Ya sea que busques una foto casual o una toma profesional, este espacio ofrece el escenario perfecto para compartir en redes o guardar en tu álbum personal.',
      imagen: '../../../assets/galeriaInstalaciones/PFotografico.jpg',
      clase: 'premier',

    },
    {
      nombre: 'Comedor Interno',
      descripcion: 'Vive una experiencia gastronómica única en nuestro Comedor Interno, un lugar exclusivo donde el confort y el estilo se unen. Disfruta de platos exquisitos en un entorno moderno y elegante que te invita a quedarte un rato más. Ideal para reuniones o momentos especiales.',
      imagen: '../../../assets/galeriaInstalaciones/PComedor.jpg',
      clase: 'elite'
    },
    {
      nombre: 'Sala Parejas',
      descripcion: 'La Sala Parejas es el refugio perfecto para compartir momentos íntimos y románticos. Con un ambiente íntimo y un diseño cuidadosamente pensado, este espacio está creado para que disfrutes de la compañía de esa persona especial, lejos de las distracciones.',
      imagen: '../../../assets/galeriaInstalaciones/Pprivado.jpg',
      clase: 'premier'
    }
  ];
}
