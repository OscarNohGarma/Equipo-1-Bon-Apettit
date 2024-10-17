// feature.routes.ts
import { Routes } from '@angular/router';
import { InicioAdminComponent } from './inicio-admin/inicio-admin.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { EditProductComponent } from './menu-admin/edit-product/edit-product.component';
import { AddProductComponent } from './menu-admin/add-product/add-product.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';

export const adminRoutes: Routes = [
  {
    path: '', // Ruta para cargar el componente FeatureComponent
    title: 'Administrador - El abuelo',
    component: InicioAdminComponent,
  },
  {
    path: 'menu', // Ruta para cargar el componente FeatureComponent
    title: 'Administrar Menú - El abuelo',
    component: MenuAdminComponent,
  },
  {
    path: 'menu/edit/:id', // Nueva ruta para editar productos
    title: 'Editar Producto - El abuelo',
    component: EditProductComponent,
  },
  {
    path: 'menu/add', // Nueva ruta para editar productos
    title: 'Agregar Producto - El abuelo',
    component: AddProductComponent,
  },
  {
    path: 'ordenes', // Nueva ruta para editar productos
    title: 'Órdenes - El abuelo',
    component: OrderAdminComponent,
  },
];
