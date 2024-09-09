import { Routes } from '@angular/router';
import { GaleriaInstalacionesComponent } from './components/galeria-instalaciones/galeria-instalaciones.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MenuComponent } from './components/menu/menu.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'Galeria', component: GaleriaInstalacionesComponent },
];
