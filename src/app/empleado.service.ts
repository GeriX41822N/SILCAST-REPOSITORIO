// src/app/empleado.service.ts // <--- Usando la ruta que confirmaste para este servicio
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Role, Permission } from './auth.service'; // Reutilizamos las interfaces de AuthService

// Define una interfaz para el Empleado COMPLETO (para el CRUD principal de empleados)
export interface Empleado {
  id?: number;
  numero_empleado: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  fecha_nacimiento: string;
  correo_electronico: string;
  telefono: string;
  fecha_ingreso: string;
  nss: string | null;
  rfc: string | null;
  curp: string | null;
  calle: string;
  colonia: string;
  cp: string;
  municipio: string;
  clabe: string | null;
  banco: string | null;
  puesto: string;
  area: string;
  turno: string;
  sdr: string | null;
  sdr_imss: string | null;
  estado: string;
  fecha_baja: string | null;
  foto: string | null;
  supervisor_id: number | null;
  estado_civil: string | null;

  usuario?: User | null;
  created_at?: string;
  updated_at?: string;
}

// Define una interfaz SIMPLE para usar en dropdowns (lista b\u00E1sica)
// \u00a1CORRECCI\u00d3N!: Debe coincidir con los campos que necesitas en el dropdown del formulario de gr\u00FAa
export interface EmpleadoSimple {
    id: number;
    nombre: string;
    apellido_paterno: string;
    // Si tu backend devuelve un display_name combinado, puedes usarlo en la interfaz y el HTML
    // display_name?: string;
}


@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private apiUrl = 'http://localhost:8000/api'; // Aseg\u00FArate de que esta es la URL correcta de tu API

  constructor(private http: HttpClient) { }

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(`${this.apiUrl}/empleados`);
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/empleados/${id}`);
  }

  createEmpleado(empleadoData: any): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.apiUrl}/empleados`, empleadoData);
  }

  updateEmpleado(id: number, empleadoData: any): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/empleados/${id}`, empleadoData);
  }

  deleteEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/empleados/${id}`);
  }

  // \u00a1CORRECCI\u00d3N!: Ajustamos el tipo de retorno para que use la interfaz EmpleadoSimple que definimos
  getEmpleadosListSimple(): Observable<EmpleadoSimple[]> {
    // Asumiendo que tienes un endpoint /api/employees-list en tu backend
    // y que devuelve un array de objetos { id: number, nombre: string, apellido_paterno: string }
    return this.http.get<EmpleadoSimple[]>(`${this.apiUrl}/employees-list`);
  }
}