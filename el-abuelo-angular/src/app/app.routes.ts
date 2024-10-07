import { Routes } from '@angular/router';
import { homeRoutes } from './home/home.routes';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { adminRoutes } from './admin/admin.routes';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [...homeRoutes],
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: [...adminRoutes],
  },
];
