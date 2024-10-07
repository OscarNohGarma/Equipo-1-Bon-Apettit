// feature.routes.ts
import { Routes } from '@angular/router';
import { InicioAdminComponent } from './inicio-admin/inicio-admin.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { EditProductComponent } from './menu-admin/edit-product/edit-product.component';

export const adminRoutes: Routes = [
  {
    path: '', // Ruta para cargar el componente FeatureComponent
    title: 'Administrador - El abuelo',
    component: InicioAdminComponent,
  },
  {
    path: 'menu', // Ruta para cargar el componente FeatureComponent
    title: 'Administrador - El abuelo',
    component: MenuAdminComponent,
  },
  {
    path: 'menu/edit/:id', // Nueva ruta para editar productos
    title: 'Editar Producto - El abuelo',
    component: EditProductComponent,
  },
];
