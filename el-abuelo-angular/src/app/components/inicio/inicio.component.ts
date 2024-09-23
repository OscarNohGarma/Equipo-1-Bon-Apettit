import { Component } from '@angular/core';
import { GaleriaInstalacionesComponent } from "../galeria-instalaciones/galeria-instalaciones.component";
import { CarruselClienteComponent } from "../carrusel-cliente/carrusel-cliente.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [GaleriaInstalacionesComponent, CarruselClienteComponent, FooterComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}
