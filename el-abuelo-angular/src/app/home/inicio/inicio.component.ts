import { Component } from '@angular/core';
import { GaleriaInstalacionesComponent } from '../../shared/galeria-instalaciones/galeria-instalaciones.component';
import { CarruselClienteComponent } from './carrusel-cliente/carrusel-cliente.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { MenuWelcomeComponent } from './menu-welcome/menu-welcome.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    GaleriaInstalacionesComponent,
    CarruselClienteComponent,
    FooterComponent,
    NosotrosComponent,
    NavbarComponent,
    MenuWelcomeComponent,
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent {}
