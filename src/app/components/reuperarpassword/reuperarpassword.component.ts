import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../../services/user/user-service.service';

@Component({
  selector: 'app-reuperarpassword',
  imports: [FormsModule],
  templateUrl: './reuperarpassword.component.html',
  styleUrl: './reuperarpassword.component.scss'
})
export class ReuperarpasswordComponent {

  email = '';

  constructor(private usr: UserServiceService){}

  

  recuperarPassword() {
    console.log("Email ingresado:", this.email);

    // Llama al servicio con el email
    this.usr.recuperarPassword({ email: this.email }).subscribe({
      next: (respuesta) => {
        console.log('Respuesta del backend:', respuesta);
        // Puedes mostrar un mensaje al usuario aquí
      },
      error: (err) => {
        console.error('Error al recuperar contraseña:', err);
      }
    });

}
}
