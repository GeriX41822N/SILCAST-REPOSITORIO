import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Importa HttpClient y HttpParams
import { Observable } from 'rxjs'; // Importa Observable

// Define la URL base de tu API de Laravel
// Asegúrate de que esta URL sea correcta para tu entorno de desarrollo/producción
const API_URL = 'http://localhost:8000/api'; // Ajusta si tu API está en otra URL o puerto

// --- Interfaces de TypeScript ---
// Define la estructura de un registro de Entrada/Salida de Grúa
export interface EntradaSalidaGrua {
  id?: number; // El ID es opcional al crear
  grua_id: number;
  empleado_id: number;
  cliente_id: number | null; // cliente_id puede ser null
  tipo_movimiento: 'entrada' | 'salida'; // Solo acepta estos dos valores
  fecha_hora: string; // Usaremos string para enviar/recibir fechas (formato ISO 8601 o similar)
  ubicacion_origen: string;
  ubicacion_destino: string | null; // ubicacion_destino puede ser null
  observaciones: string | null; // observaciones puede ser null
  created_at?: string; // Opcional, Laravel añade estos campos
  updated_at?: string; // Opcional, Laravel añade estos campos

  // Relaciones (cargadas desde el backend con eager loading)
  grua?: Grua; // El objeto Grua asociado (opcional, solo si se carga la relación)
  empleado?: Empleado; // El objeto Empleado asociado (opcional, solo si se carga la relación)
  cliente?: Cliente; // El objeto Cliente asociado (opcional, solo si se carga la relación)
}

// Define la estructura básica de una Grúa (ajusta según tu modelo Grua en Laravel)
export interface Grua {
    id: number;
    numero_identificador: string;
    modelo: string;
    // Agrega aquí otros campos relevantes de tu tabla 'gruas'
    // capacidad?: string;
    // estado?: string;
}

// Define la estructura básica de un Empleado (ajusta según tu modelo Empleado en Laravel)
export interface Empleado {
    id: number;
    numero_empleado: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno?: string | null;
    // Agrega aquí otros campos relevantes de tu tabla 'empleados' si los necesitas en el frontend
    // correo_electronico?: string;
    // telefono?: string;
    // usuario?: any; // Si cargas la relación de usuario
}

// Define la estructura básica de un Cliente (ajusta según tu modelo Cliente en Laravel)
export interface Cliente {
    id: number;
    nombre: string;
    // Agrega aquí otros campos relevantes de tu tabla 'clientes'
    // direccion?: string;
    // telefono?: string;
}


@Injectable({
  providedIn: 'root'
})
export class EntradaSalidaGruaService {

  private apiUrl = `${API_URL}/movimientos-grua`; // URL base para los movimientos de grúa

  constructor(private http: HttpClient) { } // Inyecta HttpClient

  /**
   * Obtiene todos los registros de movimientos de grúas.
   * @returns Un Observable con un array de registros de movimientos.
   */
  getMovimientos(): Observable<EntradaSalidaGrua[]> {
    return this.http.get<EntradaSalidaGrua[]>(this.apiUrl);
  }

  /**
   * Obtiene un registro de movimiento por su ID.
   * @param id El ID del registro de movimiento.
   * @returns Un Observable con el registro de movimiento.
   */
  getMovimientoById(id: number): Observable<EntradaSalidaGrua> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<EntradaSalidaGrua>(url);
  }

  /**
   * Crea un nuevo registro de movimiento.
   * @param movimiento Los datos del registro de movimiento a crear.
   * @returns Un Observable con el registro de movimiento creado.
   */
  createMovimiento(movimiento: EntradaSalidaGrua): Observable<EntradaSalidaGrua> {
    return this.http.post<EntradaSalidaGrua>(this.apiUrl, movimiento);
  }

  /**
   * Actualiza un registro de movimiento existente.
   * @param id El ID del registro de movimiento a actualizar.
   * @param movimiento Los datos actualizados del registro de movimiento.
   * @returns Un Observable con el registro de movimiento actualizado.
   */
  updateMovimiento(id: number, movimiento: EntradaSalidaGrua): Observable<EntradaSalidaGrua> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<EntradaSalidaGrua>(url, movimiento); // Usamos PUT o PATCH según cómo lo definiste en Laravel (apiResource usa PUT/PATCH)
  }

  /**
   * Elimina un registro de movimiento existente.
   * @param id El ID del registro de movimiento a eliminar.
   * @returns Un Observable (la respuesta de Laravel 204 No Content no tiene cuerpo).
   */
  deleteMovimiento(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url); // Usamos <void> porque la respuesta 204 no tiene cuerpo
  }

   /**
    * Obtiene registros de movimientos filtrados por rango de fechas.
    * @param startDate La fecha de inicio del rango (formato YYYY-MM-DD).
    * @param endDate La fecha de fin del rango (formato YYYY-MM-DD).
    * @returns Un Observable con un array de registros de movimientos filtrados.
    */
   filterMovimientosByDate(startDate?: string | null, endDate?: string | null): Observable<EntradaSalidaGrua[]> {
       let params = new HttpParams();
       if (startDate) {
           params = params.set('start_date', startDate);
       }
       if (endDate) {
           params = params.set('end_date', endDate);
       }
       const url = `${API_URL}/movimientos-grua/filter-by-date`;
       return this.http.get<EntradaSalidaGrua[]>(url, { params });
   }

   /**
    * Obtiene los registros de movimientos de una grúa específica.
    * @param gruaId El ID de la grúa.
    * @returns Un Observable con un array de registros de movimientos de la grúa.
    */
   getMovimientosByGrua(gruaId: number): Observable<EntradaSalidaGrua[]> {
       const url = `${API_URL}/movimientos-grua/by-grua/${gruaId}`;
       return this.http.get<EntradaSalidaGrua[]>(url);
   }

    // Puedes añadir aquí otros métodos de filtrado si los implementas en el backend
    // Por ejemplo: filterMovimientosByEmpleado(empleadoId: number): Observable<EntradaSalidaGrua[]> { ... }

}
