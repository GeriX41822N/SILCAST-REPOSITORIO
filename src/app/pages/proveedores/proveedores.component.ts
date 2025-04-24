import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProveedoresService, Proveedor } from '../../proveedores.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss'
})
export class ProveedoresComponent implements OnInit {

  proveedores: Proveedor[] = [];
  isLoading: boolean = true;
  error: string | null = null;

  // Propiedad para manejar la creación y edición
  nuevoProveedor: Proveedor = {
    nombre: '',
    contacto: '',
    telefono: '',
    correo: '',
    direccion: '',
    notas: ''
  };

  // Variables para controlar la visibilidad del formulario y el modo
  showForm: boolean = false; // Controla si el formulario es visible
  isEditing: boolean = false; // True si estamos editando, false si creamos

  constructor(
    private proveedoresService: ProveedoresService
  ) { }

  ngOnInit(): void {
    console.log('ProveedoresComponent: Inicializando. Cargando proveedores...');
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.isLoading = true;
    this.error = null;

    this.proveedoresService.getProveedores().subscribe({
      next: (data: Proveedor[]) => {
        console.log('ProveedoresComponent: Proveedores cargados exitosamente.', data);
        this.proveedores = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('ProveedoresComponent: Error al cargar proveedores.', error);
        this.error = 'Error al cargar los proveedores. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    });
  }

  // Método para mostrar el formulario en modo creación
  showCreateForm(): void {
    this.showForm = true;
    this.isEditing = false;
    // Limpiar el objeto para que sea uno nuevo
    this.nuevoProveedor = { nombre: '', contacto: '', telefono: '', correo: '', direccion: '', notas: '' };
  }

  // Método llamado al hacer clic en "Editar" en la tabla
  editProveedor(proveedor: Proveedor): void {
    this.showForm = true;
    this.isEditing = true;
    // Cargar los datos del proveedor a editar en el formulario
    // Hacemos una copia para no modificar el objeto original en la tabla directamente
    this.nuevoProveedor = { ...proveedor };
  }

  // Método llamado al hacer clic en "Cancelar"
  cancelEdit(): void {
    this.showForm = false;
    this.isEditing = false;
    // Opcional: Limpiar el objeto nuevoProveedor también
    this.nuevoProveedor = { nombre: '', contacto: '', telefono: '', correo: '', direccion: '', notas: '' };
  }

  // ----------- Método para guardar (Crear o Actualizar) -----------
  saveProveedor(): void {
    console.log('Intentando guardar proveedor:', this.nuevoProveedor);

     // Validar que al menos el nombre no esté vacío
    if (!this.nuevoProveedor.nombre) {
      alert('El nombre del proveedor es obligatorio.');
      return;
    }

    if (this.isEditing) {
      // Lógica para Actualizar
      // Asegúrate de que el ID existe si estás editando
      if (this.nuevoProveedor.id === undefined) {
           console.error('Error: Intentando actualizar sin ID de proveedor.');
           alert('Ocurrió un error al intentar actualizar. Faltan datos del proveedor.');
           return;
      }

      this.proveedoresService.updateProveedor(this.nuevoProveedor.id, this.nuevoProveedor).subscribe({
        next: (response: Proveedor) => {
          console.log('Proveedor actualizado exitosamente:', response);
          alert('Proveedor actualizado con éxito!');
          this.cancelEdit(); // Cerrar formulario y resetear estado
          this.loadProveedores(); // Recargar la lista
        },
        error: (error: any) => {
          console.error('Error al actualizar proveedor:', error);
          // Manejar errores de validación o de servidor
          if (error.status === 422 && error.error && error.error.errors) {
              let validationErrors = '';
              for (const field in error.error.errors) {
                  validationErrors += `${field}: ${error.error.errors[field].join(', ')}\n`;
              }
              alert('Error de validación al actualizar:\n' + validationErrors);
          } else {
             alert('Ocurrió un error al actualizar el proveedor. Por favor, inténtalo de nuevo.');
          }
        }
      });

    } else {
      // Lógica para Crear (la que ya teníamos)
       this.proveedoresService.createProveedor(this.nuevoProveedor).subscribe({
        next: (response: Proveedor) => {
          console.log('Proveedor creado exitosamente:', response);
          alert('Proveedor creado con éxito!');
          this.cancelEdit(); // Cerrar formulario y resetear estado
          this.loadProveedores(); // Recargar la lista
        },
        error: (error: any) => {
          console.error('Error al crear proveedor:', error);
           if (error.status === 422 && error.error && error.error.errors) {
              let validationErrors = '';
              for (const field in error.error.errors) {
                  validationErrors += `${field}: ${error.error.errors[field].join(', ')}\n`;
              }
               alert('Error de validación al crear:\n' + validationErrors);
          } else {
             alert('Ocurrió un error al crear el proveedor. Por favor, inténtalo de nuevo.');
          }
        }
      });
    }
  }

  // ----------- Método para eliminar proveedor -----------
  deleteProveedor(id: number): void {
    // Pedir confirmación antes de eliminar
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.')) {
      console.log('Intentando eliminar proveedor con ID:', id);

      this.proveedoresService.deleteProveedor(id).subscribe({
        next: (response: any) => { // La respuesta puede variar (ej: { message: 'Proveedor eliminado' })
          console.log('Proveedor eliminado exitosamente:', response);
          alert('Proveedor eliminado con éxito!');
          this.loadProveedores(); // Recargar la lista para reflejar la eliminación
           // Si el proveedor que estamos editando es el que se eliminó, cerrar el formulario de edición
          if (this.isEditing && this.nuevoProveedor.id === id) {
              this.cancelEdit();
          }
        },
        error: (error: any) => {
          console.error('Error al eliminar proveedor:', error);
          // Manejar posibles errores (ej: proveedor no encontrado, o tiene relaciones)
          alert('Ocurrió un error al eliminar el proveedor. Por favor, inténtalo de nuevo.');
        }
      });
    } else {
      console.log('Eliminación cancelada por el usuario.');
    }
  }


  // Puedes añadir aquí métodos adicionales si los necesitas
}