import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service'; // <-- Importa tu AuthService (ajusta la ruta si es necesario)
import { Router } from '@angular/router'; // <-- Importa Router para redirigir
import { CommonModule } from '@angular/common'; // <-- Posiblemente necesites importar CommonModule para *ngIf

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule // <-- Agrega CommonModule aquí si usas *ngIf en el template
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = ''; // <-- ¡Cambiamos el nombre de la propiedad de username a email!
  password: string = '';
  errorMessage: string | null = null; // Para mostrar mensajes de error al usuario

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin() {
    // Limpiamos cualquier mensaje de error anterior
    this.errorMessage = null;

    console.log('Intentando iniciar sesión desde el componente de Login...');
    console.log('Email:', this.email); // <-- Ahora usamos this.email
    console.log('Contraseña:', this.password);

    // Llamamos al método login del AuthService
    // Asegúrate de pasar this.email
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso desde LoginComponent');
        // El token ya se guardó en localStorage dentro del AuthService

        // Redirigir al usuario a una página protegida después del login exitoso
        this.router.navigate(['/dashboard']); // <-- Cambia '/dashboard' a la ruta que quieras
      },
      error: (error) => {
        console.error('Error en el login desde LoginComponent:', error);
        // Mostrar un mensaje de error al usuario (ej: credenciales inválidas)
        if (error.status === 401) {
          this.errorMessage = 'Correo electrónico o contraseña inválidos.'; // Mensaje más específico
        } else {
          this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo más tarde.';
        }
      }
    });
  }

  // Puedes añadir otros métodos aquí si los necesitas
}