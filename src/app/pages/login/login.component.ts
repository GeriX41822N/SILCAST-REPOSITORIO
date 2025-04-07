import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // 👈 Importa FormsModule aquí

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // 👈 Agrégalo aquí
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  onLogin() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    // Aquí puedes conectar después con Laravel
  }
}
