import { Component } from '@angular/core';
import { ServiciosComponent } from '../servicios/servicios.component'; // 👈 Importa el componente

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ServiciosComponent], // 👈 Agrégalo aquí
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent { }
