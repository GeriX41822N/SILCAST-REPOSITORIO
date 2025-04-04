import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-header',
  imports: [RouterModule], // Agrega RouterModule a los imports
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}