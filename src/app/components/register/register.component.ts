import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../../services/user/user-service.service';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  private alertService = inject(AlertService)



  usuario = {
    Nombre: '',
    Apellido: '',
    Email: '',
    Password: '',
    Rol: 'cliente'
  };

  constructor(private userService: UserServiceService, private router: Router) {}

  registrarse() {
    this.userService.postRegisterUser(this.usuario).subscribe({
      next: (respuesta) => {
        console.log('Usuario registrado:', respuesta);
        this.alertService.showSuccess('Succes','Usuario registrado exitosamente');
        this.router.navigate(['/home']);

      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        const msg = error.error?.Mensaje;
        this.alertService.showError('Eroor',msg);
      }
    });
  }
}






