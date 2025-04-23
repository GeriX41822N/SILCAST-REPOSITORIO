import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; // Importa throwError
import { tap, catchError } from 'rxjs/operators'; // Importa operadores tap y catchError
import { Router } from '@angular/router'; // Importa Router (si usas routing)

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api'; // URL base de tu API de Laravel
  private tokenKey = 'sanctum_token'; // Clave para guardar el token en localStorage

  constructor(
    private http: HttpClient,
    private router: Router // Inyecta Router si usas routing para redirigir en logout/error
  ) { }

  /**
   * Envía las credenciales de login a la API de Laravel.
   * Guarda el token en localStorage si el login es exitoso.
   * @param email El email del usuario.
   * @param password El password del usuario.
   * @returns Un Observable con la respuesta de la API (incluyendo el token).
   */
  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Si el login es exitoso y recibimos un access_token, lo guardamos
        if (response && response.access_token) {
          this.saveToken(response.access_token);
          console.log('Token guardado en localStorage.');
          // Opcional: redirigir al usuario a una página protegida
          // this.router.navigate(['/dashboard']);
        }
      }),
      catchError(error => {
        // Maneja errores de login (ej: credenciales inválidas)
        console.error('Error en el servicio de login:', error);
        // No guardamos token si hay error
        return throwError(() => error); // Relanza el error para que el componente lo maneje
      })
    );
  }

  /**
   * Guarda el token en localStorage.
   * @param token El token a guardar.
   */
  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token de localStorage.
   * @returns El token si existe, de lo contrario null.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Verifica si el usuario está logeado (si hay un token en localStorage).
   * Puedes añadir validaciones adicionales (ej: token expirado) si es necesario.
   * @returns true si hay un token, de lo contrario false.
   */
  isLoggedIn(): boolean {
    // Una verificación simple: solo revisa si el token existe.
    // En apps reales, podrías necesitar verificar la expiración del token.
    return this.getToken() !== null;
  }

  /**
   * Elimina el token de localStorage para cerrar la sesión.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    console.log('Token eliminado de localStorage. Sesión cerrada.');
    // Opcional: redirigir al usuario a la página de login
    // this.router.navigate(['/login']);
  }

  // Método opcional para manejar respuestas 401 no autorizadas (lo usaremos en el interceptor)
  handleUnauthorized(): void {
    console.warn('Petición no autorizada (401). Cerrando sesión.');
    this.logout(); // Cierra la sesión localmente
    // Opcional: redirigir al usuario a la página de login
    // this.router.navigate(['/login']);
  }
}