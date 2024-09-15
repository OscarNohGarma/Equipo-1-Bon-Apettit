import { Component } from '@angular/core';
import { GaleriaInstalacionesComponent } from "../galeria-instalaciones/galeria-instalaciones.component";

@Component({
  selector: 'app-inicio',
  standalone: true,

  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
  imports: [GaleriaInstalacionesComponent]
})
export class InicioComponent {

}
