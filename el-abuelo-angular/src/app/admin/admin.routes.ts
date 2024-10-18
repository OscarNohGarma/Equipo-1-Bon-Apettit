// feature.routes.ts
import { Routes } from '@angular/router';
import { InicioAdminComponent } from './inicio-admin/inicio-admin.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { EditProductComponent } from './menu-admin/edit-product/edit-product.component';
import { AddProductComponent } from './menu-admin/add-product/add-product.component';
import { OrderAdminComponent } from './order-admin/order-admin.component';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminLoginComponent } from './admin-login/admin-login.component';

export const adminRoutes: Routes = [
  {
    path: '',
    title: 'Administrador - El abuelo',
    component: InicioAdminComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'menu',
    title: 'Administrar Menú - El abuelo',
    component: MenuAdminComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'menu/edit/:id',
    title: 'Editar Producto - El abuelo',
    component: EditProductComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'menu/add',
    title: 'Agregar Producto - El abuelo',
    component: AddProductComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'ordenes',
    title: 'Órdenes - El abuelo',
    component: OrderAdminComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'login',
    title: 'Login - Administrador',
    component: AdminLoginComponent, // Componente de login del admin
  },
];
