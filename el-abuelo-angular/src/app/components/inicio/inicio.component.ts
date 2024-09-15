import { Component } from '@angular/core';
import { GaleriaInstalacionesComponent } from "../galeria-instalaciones/galeria-instalaciones.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [GaleriaInstalacionesComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}
