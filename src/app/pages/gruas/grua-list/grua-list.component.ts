// src/app/pages/gruas/grua-list/grua-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Importar servicio de gr\u00FAas y la interfaz Grua
// Verifica la ruta: Deber\u00EDa ser '../../../services/grua.service'
import { GruaService, Grua } from '../../../services/grua.service';
// Importar AuthService
// Verifica la ruta: Deber\u00EDa ser '../../../auth.service' o '../../../services/auth.service'
import { AuthService } from '../../../auth.service';


import { catchError, of } from 'rxjs'; // Para manejo b\u00E1sico de errores

@Component({
  selector: 'app-grua-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './grua-list.component.html',
  styleUrls: ['./grua-list.component.scss']
})
export class GruaListComponent implements OnInit {

  gruas: Grua[] = []; // Almacena la lista de gr\u00FAas
  isLoading: boolean = true; // Indicador de carga
  error: string | null = null; // Mensaje de error

  constructor(
    private gruaService: GruaService, // Servicio de gr\u00FAas
    public authService: AuthService, // Servicio de autenticaci\u00F3n (para permisos)
    private router: Router // Router para navegaci\u00F3n
  ) { }

  ngOnInit(): void {
    console.log('GruaListComponent: Inicializando. Cargando lista de grúas...');
    this.loadGruas(); // Cargar las gr\u00FAas al iniciar
  }

  // Carga la lista completa de gr\u00FAas desde el backend
  loadGruas(): void {
    this.isLoading = true;
    this.error = null;

    this.gruaService.getGruas().pipe(
      catchError(error => {
        console.error('GruaListComponent: Error al cargar grúas.', error);
         if (error.status === 403) {
            this.error = 'No tienes permiso para ver la lista de grúas.';
         } else {
            this.error = 'Error al cargar la lista de grúas. Por favor, inténtalo de nuevo.';
         }
        this.isLoading = false;
        return of([]); // Devuelve un observable vac\u00EDo en caso de error
      })
    ).subscribe(
      (data: Grua[]) => {
        console.log('GruaListComponent: Grúas cargadas exitosamente.', data);
        this.gruas = data; // Asigna los datos
        this.isLoading = false;
      }
    );
  }

  // --- M\u00E9todos para el CRUD ---

  // Navega al formulario de creaci\u00F3n
  showCreateForm(): void {
      console.log('Navegando a formulario de creaci\u00F3n de gr\u00FAa');
      this.router.navigate(['/gruas/new']);
  }

  // Navega al formulario de edici\u00F3n con el ID de la gr\u00FAa
  editGrua(grua: Grua): void {
      console.log('Navegando a formulario de edici\u00F3n para grúa ID:', grua.id);
      this.router.navigate(['/gruas/edit', grua.id]);
  }

  // Implementaci\u00F3n de la l\u00F3gica para eliminar una gr\u00FAa
  deleteGrua(id: number): void {
      // Mostrar un di\u00E1logo de confirmaci\u00F3n al usuario
      if (confirm('¿Estás seguro de que deseas eliminar esta grúa?')) {
          console.log('GruaListComponent: Eliminando grúa con ID:', id);
          this.isLoading = true; // Mostrar indicador de carga mientras se elimina

          this.gruaService.deleteGrua(id).pipe(
              catchError(error => {
                  console.error('GruaListComponent: Error al eliminar grúa.', error);
                   if (error.status === 403) {
                       alert('No tienes permiso para eliminar grúas.');
                   } else if (error.status === 404) {
                        alert('La grúa que intentas eliminar no fue encontrada.');
                   }
                   else {
                       alert('Error al eliminar la grúa. Por favor, inténtalo de nuevo.');
                   }
                  this.isLoading = false;
                  return of(null); // Retorna null en caso de error para no detener la suscripci\u00F3n
              })
          ).subscribe(
              () => { // No esperamos cuerpo en la respuesta 204 (No Content)
                  console.log('GruaListComponent: Grúa eliminada exitosamente.', id);
                  alert('Grúa eliminada con éxito.');
                  // Eliminar la gr\u00FAa de la lista localmente para actualizar la vista
                  this.gruas = this.gruas.filter(grua => grua.id !== id);
                  this.isLoading = false;
              }
              // Nota: Los errores se manejan en el catchError, no necesitamos un segundo callback en subscribe si solo manejamos \u00E9xito
          );
      } else {
          console.log('GruaListComponent: Eliminaci\u00F3n cancelada por el usuario.');
      }
  }
  // --- Fin M\u00E9todos CRUD ---


  // M\u00E9todos helper para verificar permisos en la plantilla (HTML)
  canViewGruas(): boolean {
      return this.authService.hasPermission('view gruas');
  }
  canCreateGruas(): boolean {
       return this.authService.hasPermission('create gruas');
  }
  canEditGruas(): boolean {
      return this.authService.hasPermission('edit gruas');
  }
  canDeleteGruas(): boolean {
      return this.authService.hasPermission('delete gruas');
  }

}