import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../../services/user/user-service.service';
import { Router } from '@angular/router';

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
    password: '',
    rol: 'cliente'
  };

  constructor(private userService: UserServiceService, private router: Router) {}

  registrarse() {
    this.userService.postRegisterUser(this.usuario).subscribe({
      next: (respuesta) => {
        console.log('Usuario registrado:', respuesta);
        this.router.navigate(['/home']);

      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
      }
    });
  }
}






