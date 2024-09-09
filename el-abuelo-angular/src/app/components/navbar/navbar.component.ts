import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { GaleriaInstalacionesComponent } from '../galeria-instalaciones/galeria-instalaciones.component';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, GaleriaInstalacionesComponent, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {}
