import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioComponent } from './home/inicio/inicio.component';
import { GaleriaInstalacionesComponent } from './home/inicio/galeria-instalaciones/galeria-instalaciones.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    GaleriaInstalacionesComponent,
    InicioComponent,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'el-abuelo-angular';
}
