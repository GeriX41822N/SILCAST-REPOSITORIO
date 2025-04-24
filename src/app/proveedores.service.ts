import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ¡Interfaz Proveedor actualizada para coincidir con el backend!
export interface Proveedor {
  id?: number;
  nombre: string;
  contacto?: string; // Corresponde al campo 'contacto' en el backend
  telefono?: string;
  correo?: string;   // Corresponde al campo 'correo' en el backend
  direccion?: string;
  notas?: string;    // Campo 'notas' del backend
  created_at?: string; // Laravel añade timestamps
  updated_at?: string; // Laravel añade timestamps
}

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  private apiUrl = 'http://localhost:8000/api/proveedores';

  constructor(private http: HttpClient) { }

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl);
  }

  getProveedor(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/${id}`);
  }

  // createProveedor ahora recibe un objeto que coincide con la interfaz actualizada
  createProveedor(proveedor: Proveedor): Observable<Proveedor> {
    // ¡Asegúrate de enviar los datos con los nombres correctos del backend!
    const payload = {
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      correo: proveedor.correo,
      direccion: proveedor.direccion,
      notas: proveedor.notas
      // No incluyas 'id', 'created_at', 'updated_at' al crear
    };
    return this.http.post<Proveedor>(this.apiUrl, payload);
  }

  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    // Similarmente, asegura que los datos enviados coincidan con el backend
     const payload = {
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      correo: proveedor.correo,
      direccion: proveedor.direccion,
      notas: proveedor.notas
      // No incluyas 'id', 'created_at', 'updated_at' al actualizar (aunque a veces el backend los ignora)
    };
    return this.http.put<Proveedor>(`${this.apiUrl}/${id}`, payload);
  }


  deleteProveedor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}