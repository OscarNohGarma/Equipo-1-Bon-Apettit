import { Routes } from '@angular/router';
import { homeRoutes } from './home/home.routes';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [...homeRoutes],
  },
];
