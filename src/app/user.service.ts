import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Role, Permission } from './auth.service'; // Reutilizamos las interfaces de AuthService

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8000/api'; // Asegúrate de que esta es la URL correcta de tu API

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de todos los usuarios desde el backend.
   * Requiere permiso 'view users'.
   */
  getUsers(): Observable<User[]> {
    // La verificación de permisos se realiza en el backend (UserController@index)
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  /**
   * Obtiene la lista de todos los roles disponibles desde el backend.
   * Requiere permiso 'view users' (o el que hayas definido en UserController@getRoles).
   */
  getRoles(): Observable<Role[]> {
     // La verificación de permisos se realiza en el backend (UserController@getRoles)
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  /**
   * Obtiene los detalles de un usuario específico por su ID.
   * Requiere permiso 'view users'.
   * @param id El ID del usuario.
   */
  getUser(id: number): Observable<User> {
    // La verificación de permisos se realiza en el backend (UserController@show)
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  /**
   * Crea un nuevo usuario en el backend.
   * Requiere permiso 'create users'.
   * @param userData Los datos del nuevo usuario (incluyendo email, password, empleado_id opcional, y roles opcionales).
   */
  createUser(userData: any): Observable<User> {
     // La verificación de permisos se realiza en el backend (UserController@store)
    return this.http.post<User>(`${this.apiUrl}/users`, userData);
  }

  /**
   * Actualiza un usuario existente en el backend.
   * Requiere permiso 'edit users'.
   * @param id El ID del usuario a actualizar.
   * @param userData Los datos actualizados del usuario (incluyendo roles opcionales).
   */
  updateUser(id: number, userData: any): Observable<User> {
     // La verificación de permisos se realiza en el backend (UserController@update)
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, userData);
  }

  /**
   * Elimina un usuario del backend.
   * Requiere permiso 'delete users'.
   * @param id El ID del usuario a eliminar.
   */
  deleteUser(id: number): Observable<void> {
     // La verificación de permisos se realiza en el backend (UserController@destroy)
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Puedes añadir aquí métodos adicionales si necesitas gestionar permisos directos, etc.
  // assignRoleToUser(userId: number, roleName: string): Observable<any> { ... }
  // removeRoleFromUser(userId: number, roleName: string): Observable<any> { ... }
}
