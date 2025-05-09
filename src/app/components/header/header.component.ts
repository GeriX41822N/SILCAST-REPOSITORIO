import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service'; // <-- Importa AuthService 
import { Router } from '@angular/router'; // <-- Importa Router
import { CommonModule } from '@angular/common'; // <-- Importa CommonModule 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule // <-- Agrega CommonModule a los imports si usas *ngIf o *ngFor en el HTML
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    private authService: AuthService, // <-- Inyecta AuthService
    private router: Router // <-- Inyecta Router
  ) { }

  // **Método para manejar el logout**
  onLogout(): void {
    console.log('HeaderComponent: Intentando cerrar sesión desde la cabecera...');
    // ¡Suscríbete al Observable que devuelve logout()!
    this.authService.logout().subscribe({
      next: () => {
        console.log('HeaderComponent: Logout exitoso (backend y local). Redirigiendo...');
        // La redirección ahora se realiza después de que el servicio haya completado su lógica (incluida la limpieza local)
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('HeaderComponent: Error durante el logout.', err);
        // Aunque haya un error en la llamada al backend, la limpieza local ya se manejó
        // en el catchError del servicio. Aún así, redirigimos.
        this.router.navigate(['/login']);
      }
    });
    // Elimina la línea de console.log y this.router.navigate que estaban fuera de la suscripción
    // console.log('HeaderComponent: Sesión cerrada. Redirigiendo a /login.'); // ¡Elimina o comenta esta línea!
  }

  // Método para verificar si el usuario está logeado (usado en el template)
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // O this.authService.isLoggedIn$.getValue() si prefieres el BehaviorSubject directo
  }

}