import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf, *ngFor
import { FormsModule } from '@angular/forms'; // Necesario para ngModel (para los filtros de fecha y selección de grúa)

// Importar servicios e interfaces
import { EntradaSalidaGruaService, EntradaSalidaGrua, Grua, Empleado, Cliente } from '../../../services/entrada-salida-grua.service'; // Importa el servicio y las interfaces de movimientos
import { AuthService } from '../../../auth.service'; // Importa AuthService para permisos
// Importa GruaService y la interfaz GruaSimple
import { GruaService, GruaSimple } from '../../../services/grua.service';

import { catchError, of, Observable } from 'rxjs'; // Importa catchError, of y Observable

@Component({
  selector: 'app-movimientos-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // Asegúrate de importar FormsModule
  ],
  templateUrl: './movimientos-list.component.html',
  styleUrls: ['./movimientos-list.component.scss']
})
export class MovimientosListComponent implements OnInit {

  movimientos: EntradaSalidaGrua[] = []; // Lista de registros de movimientos
  gruas: GruaSimple[] = []; // Lista de grúas para el filtro (dropdown), ahora de tipo GruaSimple[]
  isLoading: boolean = true; // Indicador de carga
  error: string | null = null; // Mensaje de error

  // Propiedades para el filtrado
  filterStartDate: string | null = null; // Fecha de inicio para filtrar
  filterEndDate: string | null = null; // Fecha de fin para filtrar
  selectedGruaId: number | null = null; // ID de la grúa seleccionada para filtrar

  // Variables para controlar la visibilidad del formulario de creación/edición
  // (Aunque el formulario estará en otro componente, estas variables controlarán su visualización aquí)
  showForm: boolean = false; // Controla si el formulario es visible
  isEditing: boolean = false; // True si estamos editando, false si creamos
  currentMovimientoId: number | null = null; // ID del movimiento que se está editando (si aplica)


  constructor(
    private movimientoService: EntradaSalidaGruaService, // Inyecta el servicio de movimientos
    private gruaService: GruaService, // Inyecta el servicio de grúas
    public authService: AuthService // Inyecta el AuthService (público para usar en el template)
  ) { }

  ngOnInit(): void {
    console.log('MovimientosListComponent: Inicializando. Cargando datos...');
    // Cargar la lista inicial de movimientos y la lista de grúas para el filtro
    this.loadMovimientos();
    this.loadGruasForFilter();
  }

  // Carga la lista de movimientos desde el backend (con filtros si están aplicados)
  loadMovimientos(): void {
    this.isLoading = true;
    this.error = null;

    // Determinar qué método de carga usar según los filtros
    let movimientosObservable: Observable<EntradaSalidaGrua[]>;

    if (this.selectedGruaId !== null) {
        // Si hay una grúa seleccionada, usar el filtro por grúa
        movimientosObservable = this.movimientoService.getMovimientosByGrua(this.selectedGruaId);
        console.log('Cargando movimientos filtrados por grúa:', this.selectedGruaId);
    } else if (this.filterStartDate || this.filterEndDate) {
        // Si hay fechas, usar el filtro por fecha
        movimientosObservable = this.movimientoService.filterMovimientosByDate(this.filterStartDate, this.filterEndDate);
        console.log('Cargando movimientos filtrados por fecha:', this.filterStartDate, this.filterEndDate);
    } else {
        // Si no hay filtros, cargar todos los movimientos
        movimientosObservable = this.movimientoService.getMovimientos();
        console.log('Cargando todos los movimientos.');
    }

    // Suscribirse al Observable y manejar la respuesta o el error
    movimientosObservable.pipe(
        catchError(error => {
            console.error('MovimientosListComponent: Error al cargar movimientos.', error);
             // Manejar error 403 específicamente
            if (error.status === 403) {
                this.error = 'No tienes permiso para ver la lista de movimientos de grúas.';
            } else {
                this.error = 'Error al cargar los movimientos. Por favor, inténtalo de nuevo.';
            }
            this.isLoading = false;
            return of([]); // Devuelve un observable vacío para que la suscripción no falle
        })
    ).subscribe(
        // El tipo esperado aquí es EntradaSalidaGrua[]
        (data: EntradaSalidaGrua[]) => {
            console.log('MovimientosListComponent: Movimientos cargados exitosamente.', data);
            this.movimientos = data;
            this.isLoading = false;
        }
        // No es necesario un bloque de error aquí si ya usamos catchError en el pipe
        // error => { ... }
    );
  }

  // Carga la lista simple de grúas para el dropdown de filtro
  loadGruasForFilter(): void {
     // Puedes requerir un permiso específico para cargar esta lista si no quieres que todos la vean
     // Por ahora, asumimos que si pueden ver movimientos, pueden ver la lista simple de grúas
     if (!this.authService.hasPermission('view movements')) {
         console.warn('No tienes permiso para cargar la lista de grúas para el filtro.');
         this.gruas = []; // Asegurar que la lista de grúas esté vacía
         return;
     }

     this.gruaService.getGruasListSimple().pipe(
         catchError(error => {
             console.error('MovimientosListComponent: Error al cargar lista simple de grúas.', error);
             // No establecemos un error general si falla la carga de grúas, solo registramos en consola
             this.gruas = []; // Asegurar que la lista de grúas esté vacía en caso de error
             return of([]); // Devuelve un observable vacío de grúas
         })
     ).subscribe(
         // *** CORRECCIÓN: El tipo esperado aquí es GruaSimple[] ***
         (data: GruaSimple[]) => {
           console.log('MovimientosListComponent: Lista simple de grúas cargada exitosamente.', data);
           this.gruas = data;
         }
         // No es necesario un bloque de error aquí si ya usamos catchError en el pipe
         // error => { ... }
     );
  }


  // Aplica los filtros seleccionados y recarga la lista de movimientos
  applyFilters(): void {
      // Limpiar el filtro de grúa si se aplican filtros de fecha
      if ((this.filterStartDate || this.filterEndDate) && this.selectedGruaId !== null) {
          this.selectedGruaId = null;
          console.log('Filtro de grúa limpiado al aplicar filtro de fecha.');
      }
       // Limpiar filtros de fecha si se aplica filtro de grúa
      if (this.selectedGruaId !== null && (this.filterStartDate || this.filterEndDate)) {
           this.filterStartDate = null;
           this.filterEndDate = null;
           console.log('Filtros de fecha limpiados al aplicar filtro de grúa.');
      }
      this.loadMovimientos(); // Recargar la lista con los filtros aplicados
  }

  // Limpia todos los filtros y recarga la lista completa
  clearFilters(): void {
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.selectedGruaId = null;
    console.log('Filtros limpiados.');
    this.loadMovimientos(); // Recargar la lista completa
  }


  // Muestra el formulario en modo creación
  showCreateForm(): void {
     // Opcional: Verificar permiso en frontend también (aunque el botón estará oculto sin permiso)
     if (!this.authService.hasPermission('create movements')) {
         alert('No tienes permiso para crear movimientos.');
         return;
     }
    this.showForm = true;
    this.isEditing = false;
    this.currentMovimientoId = null; // No hay ID para crear
     console.log('Mostrando formulario de creación de movimiento.');
     // Aquí podrías navegar a un componente de formulario o mostrar un modal
     // Por ahora, solo cambiamos el estado para un futuro formulario en línea o modal
  }

  // Muestra el formulario en modo edición para un movimiento específico
  editMovimiento(movimiento: EntradaSalidaGrua): void {
     // Opcional: Verificar permiso en frontend también
     if (!this.authService.hasPermission('edit movements')) {
         alert('No tienes permiso para editar movimientos.');
         return;
     }
    this.showForm = true;
    this.isEditing = true;
    this.currentMovimientoId = movimiento.id!; // Establecer el ID del movimiento a editar
     console.log('Mostrando formulario de edición de movimiento para ID:', movimiento.id);
     // Aquí podrías navegar a un componente de formulario con el ID o pasar el objeto movimiento a un modal
     // La carga de los datos del movimiento a editar se haría en el componente del formulario
  }

   // Método para manejar la cancelación o el guardado exitoso desde el formulario (si fuera un modal/componente hijo)
   // Este método sería llamado por el componente del formulario hijo
   handleFormClosed(): void {
       this.showForm = false;
       this.isEditing = false;
       this.currentMovimientoId = null;
       this.loadMovimientos(); // Recargar la lista después de guardar o cancelar
       console.log('Formulario de movimiento cerrado. Recargando lista.');
   }


  // Elimina un registro de movimiento
  deleteMovimiento(id: number): void {
     // Opcional: Verificar permiso en frontend también
     if (!this.authService.hasPermission('delete movements')) {
         alert('No tienes permiso para eliminar movimientos.');
         return;
     }

    if (confirm('¿Estás seguro de que deseas eliminar este registro de movimiento? Esta acción no se puede deshacer.')) {
      console.log('Intentando eliminar movimiento con ID:', id);

      this.movimientoService.deleteMovimiento(id).subscribe({
        next: () => { // La respuesta de delete es 204 No Content, no devuelve cuerpo
          console.log('Movimiento eliminado exitosamente.');
          alert('Registro de movimiento eliminado con éxito!');
          this.loadMovimientos(); // Recargar la lista
           // Si el formulario de edición estuviera abierto para este movimiento, podrías cerrarlo aquí
           if (this.isEditing && this.currentMovimientoId === id) {
              this.handleFormClosed(); // O simplemente this.showForm = false;
          }
        },
        error: (error: any) => {
          console.error('Error al eliminar movimiento:', error);
           if (error.status === 403) {
               alert('No tienes permiso para eliminar movimientos.');
          } else {
             alert('Ocurrió un error al eliminar el registro de movimiento. Por favor, inténtalo de nuevo.');
          }
        }
      });
    } else {
      console.log('Eliminación de movimiento cancelada por el usuario.');
    }
  }

  // Métodos helper para verificar permisos en el template
  canViewMovements(): boolean { return this.authService.hasPermission('view movements'); }
  canCreateMovements(): boolean { return this.authService.hasPermission('create movements'); }
  canEditMovements(): boolean { return this.authService.hasPermission('edit movements'); }
  canDeleteMovements(): boolean { return this.authService.hasPermission('delete movements'); }

   // Helper para obtener el nombre legible de la grúa para el filtro
   // Ahora espera un GruaSimple[] en la lista 'gruas'
   getGruaDisplayName(id: number): string {
       const grua = this.gruas.find(g => g.id === id);
       return grua ? grua.display_name : 'Grúa Desconocida';
   }

}
