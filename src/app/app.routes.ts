import { Routes } from '@angular/router';
// Importa tus otros componentes aquí...
import { InicioComponent } from './pages/inicio/inicio.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component'; // Usando el componente en pages/login
import { AdminComponent } from './pages/admin/admin.component';
import { EmpleadosListComponent } from './pages/empleados/empleados-list/empleados-list.component';

import { authGuard } from './auth.guard'; // Importa tu guard

// **Importa tu ProveedoresComponent**
import { ProveedoresComponent } from './pages/proveedores/proveedores.component'; // <-- **Ajusta esta ruta si es necesario**


export const routes: Routes = [
  // Rutas Públicas
  { path: '', component: InicioComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'servicios', component: ServiciosComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent },

  // --- Rutas Protegidas ---
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard] // Aplica el guard
  },
  {
    path: 'empleados',
    component: EmpleadosListComponent,
    canActivate: [authGuard] // Aplica el guard
  },
  // **¡Añade la ruta para Proveedores aquí!**
  {
    path: 'proveedores', // URL: /proveedores
    component: ProveedoresComponent, // Componente a cargar
    canActivate: [authGuard] // ¡Protegida por el guard!
  },

  // Aquí añadirías otras rutas protegidas

  // Ruta comodín
  { path: '**', redirectTo: '', pathMatch: 'full' }
];