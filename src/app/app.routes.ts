import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NosotrosComponent } from './pages/nosotros/nosotros.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { GaleriaComponent } from './pages/galeria/galeria.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { EmpleadosListComponent } from './pages/empleados/empleados-list/empleados-list.component';


export const routes: Routes = [
  { path: '', component: InicioComponent }, // Página de inicio
  { path: 'empleados', component: EmpleadosListComponent },
  { path: 'nosotros', component: NosotrosComponent }, // Página de nosotros
  { path: 'servicios', component: ServiciosComponent },
  { path: 'galeria', component: GaleriaComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'login', component: LoginComponent }, // Login del administrador
  { path: 'admin', component: AdminComponent }, // Página de administración
  // Rutas adicionales para otras páginas o componentes
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirigir a inicio si la ruta no existe
];
