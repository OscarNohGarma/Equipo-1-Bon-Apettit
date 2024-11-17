// feature.routes.ts
import { Routes } from '@angular/router';
import { GaleriaInstalacionesComponent } from '../shared/galeria-instalaciones/galeria-instalaciones.component';
import { InicioComponent } from './inicio/inicio.component';
import { MenuComponent } from './menu/menu.component';
import { ReservationTablesComponent } from './reservation-tables/reservation-tables.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AuthGuard } from '../auth/auth.guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { CommunityComponent } from './community/community.component';
import { AddComentarioComponent } from './community/add-comentario/add-comentario.component';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';

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
  {
    path: 'mis-reservaciones',
    title: 'Mis reservaciones- El Abuelo',
    component: MyReservationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/edit',
    title: 'Editar perfil',
    component: EditProfileComponent,
  },
  {
    path: 'login',
    title: 'Iniciar Sesión - El abuelo',
    component: LoginComponent, // Componente de login del admin
  },
  {
    path: 'registro',
    title: 'Registrarse - El abuelo',
    component: RegisterComponent, // Componente de login del admin
  },
  {
    path: 'tus-ordenes',
    title: 'Tus órdenes - El abuelo',
    component: MyOrdersComponent, // Componente de login del admin
    canActivate: [AuthGuard],
  },
  {
    path: 'comunidad',
    title: 'Comunidad - El abuelo',
    component: CommunityComponent, // Componente de login del admin
  },
  {
    path: 'agregar-comentarios',
    title: 'Agregar comentarios - El abuelo',
    component: AddComentarioComponent, // Componente de login del admin
  },
];
