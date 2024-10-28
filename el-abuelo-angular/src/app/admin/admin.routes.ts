// feature.routes.ts
import { Routes } from '@angular/router';
import { InicioAdminComponent } from './owner/inicio-admin/inicio-admin.component';
import { MenuAdminComponent } from './menu-admin/menu-admin.component';
import { EditProductComponent } from './menu-admin/edit-product/edit-product.component';
import { AddProductComponent } from './menu-admin/add-product/add-product.component';
import { OrderAdminComponent } from '../admin/cocinero/order-admin/order-admin.component';
import { AdminAuthGuard } from '../auth/admin-auth.guard';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { RolesAdminComponent } from './owner/roles-admin/roles-admin.component';
import { AddUserComponent } from './owner/roles-admin/add-user/add-user.component';
import { EditUserComponent } from './owner/roles-admin/edit-user/edit-user.component';
import { OrderReadyComponent } from './cajero/order-ready/order-ready.component';
import { OrderPaidComponent } from './owner/order-paid/order-paid.component';
import { ReportComponent } from './owner/report/report.component';
import { OrdersDealerComponent } from './repartidor/orders-dealer/orders-dealer.component';

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
    path: 'ordenes/paid',
    title: 'Órdenes - El abuelo',
    component: OrderPaidComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'ordenes/activas',
    title: 'Órdenes - El abuelo',
    component: OrderAdminComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'ordenes/listas',
    title: 'Órdenes - El abuelo',
    component: OrderReadyComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'ordenes/repartidor',
    title: 'Órdenes - El abuelo',
    component: OrdersDealerComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'roles',
    title: 'Usuarios - El abuelo',
    component: RolesAdminComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'roles/add',
    title: 'Agregar Usuario - El abuelo',
    component: AddUserComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'roles/edit/:id',
    title: 'Editar Usuario - El abuelo',
    component: EditUserComponent,
    canActivate: [AdminAuthGuard], // Protegido por el guard de admin
  },
  {
    path: 'login',
    title: 'Login - Administrador',
    component: AdminLoginComponent, // Componente de login del admin
  },
  {
    path: 'report',
    title: 'Rerpotes - Administrador',
    component: ReportComponent, // Componente de login del admin
  },
  {
    path: '**', // Ruta comodín para capturar cualquier ruta no reconocida
    redirectTo: '', // Redirigir al inicio
    pathMatch: 'full',
  },
];
