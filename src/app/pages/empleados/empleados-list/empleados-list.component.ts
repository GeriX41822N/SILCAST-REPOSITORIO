import { Component } from '@angular/core';
import { EMPLEADOS_MOCK } from '../../../../data/empleados.mock';
import { Empleado } from '../../../../app/models/empleado.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empleados-list.component.html',
  styleUrls: ['./empleados-list.component.scss']
})
export class EmpleadosListComponent {
  empleados: Empleado[] = EMPLEADOS_MOCK;

  mostrarDetallesId: string | null = null; // Guarda el ID del empleado a mostrar

  toggleDetalles(id: string) {
    this.mostrarDetallesId = this.mostrarDetallesId === id ? null : id;
  }

  get empleadoDetalle(): Empleado | undefined {
    if (this.mostrarDetallesId) {
      return this.empleados.find(empleado => empleado.id === this.mostrarDetallesId);
    }
    return undefined;
  }
}