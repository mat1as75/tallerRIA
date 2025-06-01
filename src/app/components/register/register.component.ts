import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../../services/user/user-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  };

  constructor(private userService: UserServiceService) {}

  registrarse() {
    this.userService.postRegisterUser(this.usuario).subscribe({
      next: (respuesta) => {
        console.log('Usuario registrado:', respuesta);
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
      }
    });
  }
}






