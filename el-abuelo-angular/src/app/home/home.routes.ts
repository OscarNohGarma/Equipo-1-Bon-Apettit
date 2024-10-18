// feature.routes.ts
import { Routes } from '@angular/router';
import { GaleriaInstalacionesComponent } from '../shared/galeria-instalaciones/galeria-instalaciones.component';
import { InicioComponent } from './inicio/inicio.component';
import { MenuComponent } from './menu/menu.component';
import { ReservationTablesComponent } from './reservation-tables/reservation-tables.component';

export const homeRoutes: Routes = [
  {
    path: '', // Ruta para cargar el componente FeatureComponent
    title: 'Inicio - El abuelo',
    component: InicioComponent,
  },
  {
    path: 'menu', // Otra ruta de la sección feature
    title: 'Menú - El abuelo',
    component: MenuComponent,
  },
  {
    path: 'Galeria',
    title: 'Galería - El abuelo',
    component: GaleriaInstalacionesComponent,
  },
  {
    path: 'Reservaciones',
    title: 'Reservaciones - El abuelo',
    component: ReservationTablesComponent,
  },
];
