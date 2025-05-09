import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../user.service'; // Importa el UserService
import { AuthService, User, Role } from '../../auth.service'; // Importa AuthService y las interfaces
import { catchError, of } from 'rxjs'; // Importa catchError y of para manejar errores en observables


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {

  users: User[] = []; // Lista de usuarios
  roles: Role[] = []; // Lista de roles disponibles
  isLoading: boolean = true; // Indicador de carga
  error: string | null = null; // Mensaje de error

  // Propiedad para manejar la creación y edición de un usuario
  currentUser: any = { // Usamos 'any' temporalmente para flexibilidad con password y roles en el formulario
    id: null,
    empleado_id: null, // Si tu estructura requiere empleado_id
    email: '',
    password: '', // Campo para la contraseña (solo se envía si se cambia/crea)
    roles: [] // Array para los roles seleccionados al editar/crear
  };

  // Variables para controlar la visibilidad del formulario y el modo
  showForm: boolean = false; // Controla si el formulario es visible
  isEditing: boolean = false; // True si estamos editando, false si creamos

  // Propiedad para manejar roles seleccionados en el formulario de edición/creación
  selectedRoles: number[] = []; // Array de IDs de roles seleccionados


  constructor(
    private userService: UserService, // Inyecta el UserService
    public authService: AuthService // Inyecta el AuthService (público para usar en el template)
  ) { }

  ngOnInit(): void {
    console.log('UserManagementComponent: Inicializando. Cargando datos...');
    // Cargar usuarios y roles al inicializar el componente
    this.loadUsers();
    this.loadRoles();
  }

  // Carga la lista de usuarios desde el backend
  loadUsers(): void {
    // La verificación de permiso 'view users' se hace en el backend.
    // Si el backend devuelve 403, el interceptor o el catchError lo manejarán.
    this.isLoading = true;
    this.error = null;

    this.userService.getUsers().pipe(
        catchError(error => {
            console.error('UserManagementComponent: Error al cargar usuarios.', error);
             // Manejar error 403 específicamente
            if (error.status === 403) {
                this.error = 'No tienes permiso para ver la lista de usuarios.';
            } else {
                this.error = 'Error al cargar los usuarios. Por favor, inténtalo de nuevo.';
            }
            this.isLoading = false;
            return of([]); // Devuelve un observable vacío para que la suscripción no falle
        })
    ).subscribe((data: User[]) => {
      console.log('UserManagementComponent: Usuarios cargados exitosamente.', data);
      this.users = data;
      this.isLoading = false;
    });
  }

  // Carga la lista de roles disponibles desde el backend
  loadRoles(): void {
     // La verificación de permiso 'view users' (o el que uses para getRoles) se hace en el backend.
     this.userService.getRoles().pipe(
         catchError(error => {
             console.error('UserManagementComponent: Error al cargar roles.', error);
             // Puedes manejar errores aquí si la carga de roles requiere un permiso distinto
             this.error = 'Error al cargar los roles disponibles.'; // O un error más específico
             return of([]); // Devuelve un observable vacío de roles
         })
     ).subscribe((data: Role[]) => {
       console.log('UserManagementComponent: Roles cargados exitosamente.', data);
       this.roles = data;
     });
  }


  // Muestra el formulario en modo creación
  showCreateForm(): void {
     // Opcional: Verificar permiso en frontend también
     if (!this.authService.hasPermission('create users')) {
         alert('No tienes permiso para crear usuarios.');
         return;
     }
    this.showForm = true;
    this.isEditing = false;
    // Limpiar el objeto para un nuevo usuario
    this.currentUser = { id: null, empleado_id: null, email: '', password: '', roles: [] };
    this.selectedRoles = []; // Limpiar roles seleccionados
  }

  // Muestra el formulario en modo edición
  editUser(user: User): void {
     // Opcional: Verificar permiso en frontend también
     if (!this.authService.hasPermission('edit users')) {
         alert('No tienes permiso para editar usuarios.');
         return;
     }
    this.showForm = true;
    this.isEditing = true;
    // Cargar los datos del usuario a editar en el formulario
    // Hacemos una copia para no modificar el objeto original en la tabla directamente
    this.currentUser = { ...user, password: '' }; // No cargamos el password hasheado, lo dejamos vacío
    // Cargar los IDs de los roles asignados para preseleccionar en el formulario
    this.selectedRoles = user.roles ? user.roles.map(role => role.id) : [];
     console.log('Editando usuario:', this.currentUser, 'Roles seleccionados:', this.selectedRoles);
  }

  // Cancela la edición o creación y oculta el formulario
  cancelEdit(): void {
    this.showForm = false;
    this.isEditing = false;
    this.currentUser = { id: null, empleado_id: null, email: '', password: '', roles: [] };
    this.selectedRoles = [];
  }

  // Guarda (crea o actualiza) el usuario
  saveUser(): void {
    console.log('Intentando guardar usuario:', this.currentUser, 'Roles seleccionados:', this.selectedRoles);

     // Validar campos básicos (puedes añadir más validación aquí o confiar en el backend)
     if (!this.currentUser.email || (!this.isEditing && !this.currentUser.password)) {
         alert('Email y Password (para nuevo usuario) son obligatorios.');
         return;
     }
      // Si estás creando, el empleado_id podría ser obligatorio según tu backend
      // if (!this.isEditing && !this.currentUser.empleado_id) {
      //    alert('Empleado es obligatorio para nuevos usuarios.');
      //    return;
      // }


    // Preparar los datos a enviar al backend
    const userDataToSend: any = {
        empleado_id: this.currentUser.empleado_id, // Incluir empleado_id
        email: this.currentUser.email,
        // Incluir password SOLO si se está creando O si se ha modificado en edición
        ...(this.currentUser.password && { password: this.currentUser.password }), // Añade password si no está vacío
        // Incluir el array de roles seleccionados para que el backend los sincronice
        roles: this.selectedRoles // Enviamos un array de IDs de roles
        // Puedes añadir otros campos si aplican
    };

     // Opcional: Si empleado_id es null/undefined, no enviarlo si el backend espera que sea nullable
     if (userDataToSend.empleado_id === null || userDataToSend.empleado_id === undefined) {
         delete userDataToSend.empleado_id;
     }


    if (this.isEditing) {
      // Lógica para Actualizar
       // Opcional: Verificar permiso en frontend también
       if (!this.authService.hasPermission('edit users')) {
           alert('No tienes permiso para editar usuarios.');
           return;
       }
      if (this.currentUser.id === null) {
           console.error('Error: Intentando actualizar sin ID de usuario.');
           alert('Ocurrió un error al intentar actualizar. Faltan datos del usuario.');
           return;
      }

      this.userService.updateUser(this.currentUser.id, userDataToSend).subscribe({
        next: (response: User) => {
          console.log('Usuario actualizado exitosamente:', response);
          alert('Usuario actualizado con éxito!');
          this.cancelEdit(); // Cerrar formulario y resetear estado
          this.loadUsers(); // Recargar la lista
        },
        error: (error: any) => {
          console.error('Error al actualizar usuario:', error);
           if (error.status === 403) {
               alert('No tienes permiso para editar usuarios.');
          } else if (error.status === 422 && error.error && error.error.errors) {
              let validationErrors = '';
              for (const field in error.error.errors) {
                  validationErrors += `${field}: ${error.error.errors[field].join(', ')}\n`;
              }
              alert('Error de validación al actualizar:\n' + validationErrors);
          } else {
             alert('Ocurrió un error al actualizar el usuario. Por favor, inténtalo de nuevo.');
          }
        }
      });

    } else {
      // Lógica para Crear
       // Opcional: Verificar permiso en frontend también
       if (!this.authService.hasPermission('create users')) {
           alert('No tienes permiso para crear usuarios.');
           return;
       }
       this.userService.createUser(userDataToSend).subscribe({
        next: (response: User) => {
          console.log('Usuario creado exitosamente:', response);
          alert('Usuario creado con éxito!');
          this.cancelEdit(); // Cerrar formulario y resetear estado
          this.loadUsers(); // Recargar la lista
        },
        error: (error: any) => {
          console.error('Error al crear usuario:', error);
          if (error.status === 403) {
              alert('No tienes permiso para crear usuarios.');
          } else if (error.status === 422 && error.error && error.error.errors) {
              let validationErrors = '';
              for (const field in error.error.errors) {
                  validationErrors += `${field}: ${error.error.errors[field].join(', ')}\n`;
              }
               alert('Error de validación al crear:\n' + validationErrors);
          } else {
             alert('Ocurrió un error al crear el usuario. Por favor, inténtalo de nuevo.');
          }
        }
      });
    }
  }

  // Elimina un usuario
  deleteUser(id: number): void {
     // Opcional: Verificar permiso en frontend también
     if (!this.authService.hasPermission('delete users')) {
         alert('No tienes permiso para eliminar usuarios.');
         return;
     }

    if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      console.log('Intentando eliminar usuario con ID:', id);

      this.userService.deleteUser(id).subscribe({
        next: () => { // La respuesta de delete es 204 No Content, no devuelve cuerpo
          console.log('Usuario eliminado exitosamente.');
          alert('Usuario eliminado con éxito!');
          this.loadUsers(); // Recargar la lista
           if (this.isEditing && this.currentUser.id === id) {
              this.cancelEdit(); // Cerrar formulario si se elimina el que se estaba editando
          }
        },
        error: (error: any) => {
          console.error('Error al eliminar usuario:', error);
           if (error.status === 403) {
              alert('No tienes permiso para eliminar usuarios.');
           } else {
              alert('Ocurrió un error al eliminar el usuario. Por favor, inténtalo de nuevo.');
           }
        }
      });
    } else {
      console.log('Eliminación cancelada por el usuario.');
    }
  }

  // Método para verificar si un rol está seleccionado en el formulario
  isRoleSelected(roleId: number): boolean {
     return this.selectedRoles.includes(roleId);
  }

  // Método para manejar la selección/deselección de roles en el formulario (checkboxes)
  onRoleChange(roleId: number, event: any): void {
     if (event.target.checked) {
       // Añadir el rol si está marcado y no está ya en la lista
       if (!this.selectedRoles.includes(roleId)) {
         this.selectedRoles.push(roleId);
       }
     } else {
       // Eliminar el rol si está desmarcado
       this.selectedRoles = this.selectedRoles.filter(id => id !== roleId);
     }
      console.log('Roles seleccionados actualizados:', this.selectedRoles);
  }

  // Métodos helper para verificar permisos en el template (opcional, puedes usar authService.hasPermission directamente)
  canViewUsers(): boolean { return this.authService.hasPermission('view users'); }
  canCreateUsers(): boolean { return this.authService.hasPermission('create users'); }
  canEditUsers(): boolean { return this.authService.hasPermission('edit users'); }
  canDeleteUsers(): boolean { return this.authService.hasPermission('delete users'); }
  // Puedes añadir canAssignRoles() si defines un permiso específico para eso

}
