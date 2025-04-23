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
    this.authService.logout(); // Llama al método logout del AuthService (elimina token)
    // Después de cerrar sesión localmente, redirige a la página de login
    this.router.navigate(['/login']); // <-- Redirige a la ruta de login
    console.log('HeaderComponent: Sesión cerrada. Redirigiendo a /login.');
  }

  // **Método para verificar si el usuario está logeado (usado en el template)**
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

}