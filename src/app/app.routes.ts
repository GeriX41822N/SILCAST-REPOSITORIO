import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component'; // Usando el componente en pages/login
import { AdminComponent } from './pages/admin/admin.component';
import { EmpleadosListComponent } from './pages/empleados/empleados-list/empleados-list.component';

import { authGuard } from './auth.guard'; // <-- Importa tu guard aquí

export const routes: Routes = [
  // Rutas Públicas (no requieren autenticación)
  { path: '', component: InicioComponent }, // Página de inicio
  { path: 'nosotros', component: NosotrosComponent }, // Página de nosotros
  { path: 'servicios', component: ServiciosComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent }, // Login del administrador

  // --- Rutas Protegidas (requieren autenticación) ---
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard] // <-- Aplica el guard a la ruta admin
  },
  {
    path: 'empleados',
    component: EmpleadosListComponent,
    canActivate: [authGuard] // <-- Aplica el guard a la ruta empleados
  },
  // Para la futura ruta de proveedores:
  // {
  //   path: 'proveedores',
  //   loadComponent: () => import('./components/proveedores/proveedores.component').then(m => m.ProveedoresComponent),
  //   canActivate: [authGuard] // <-- Aplica el guard también aquí 
  // },

  // Aquí añadirías otras rutas protegidas

  // Ruta comodín para cualquier otra URL no definida
  // Se puede redirigir al login o a donde quieras
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirige a inicio si la ruta no existe
];