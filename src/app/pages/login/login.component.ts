// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
// No necesitamos User aqu\u00ED si no vamos a usar los roles en la redirecci\u00F3n inmediata
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importar elementos para el manejo de errores en observables
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false; // Indicador de carga


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin() {
    this.errorMessage = null; // Limpiar mensajes de error anteriores
    this.isLoading = true; // Mostrar indicador de carga

    console.log('Intentando iniciar sesi\u00F3n desde el componente de Login...');
    console.log('Email:', this.email); // No loggear la contrase\u00F1a

    this.authService.login(this.email, this.password).pipe(
       // Manejo de errores HTTP
       catchError((error: HttpErrorResponse) => {
          console.error('Error en el login desde LoginComponent:', error);
          this.isLoading = false; // Ocultar indicador de carga en caso de error

          if (error.status === 401) {
            this.errorMessage = 'Correo electrónico o contraseña inválidos.';
          } else if (error.status === 422 && error.error && error.error.errors) {
             this.errorMessage = 'Datos de inicio de sesión inválidos.';
             console.error('Validation Errors from Backend:', error.error.errors);
          }
          else {
            this.errorMessage = 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo más tarde.';
          }
          // Retornar un observable que no emite valores en caso de error
          return of(null);
       })
    ).subscribe(response => {
        // Este bloque 'next' solo se ejecuta si la llamada HTTP fue exitosa
        console.log('Login exitoso desde LoginComponent', response);

        // \u00a1Redirecci\u00F3n SIMPLE y FIJA a la p\u00E1gina de administraci\u00F3n para CUALQUIER usuario loggeado!
        console.log('Login exitoso. Redirigiendo a /admin...');
        this.router.navigate(['/admin']); // Redirige a la ruta del componente AdminComponent


        this.isLoading = false; // Ocultar indicador de carga despu\u00E9s de la redirecci\u00F3n
    });
  }
}