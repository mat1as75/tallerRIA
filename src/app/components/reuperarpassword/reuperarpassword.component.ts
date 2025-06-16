import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserServiceService } from '../../services/user/user-service.service';
import { AlertService } from '../../services/alert/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reuperarpassword',
  imports: [FormsModule],
  templateUrl: './reuperarpassword.component.html',
  styleUrl: './reuperarpassword.component.scss'
})
export class ReuperarpasswordComponent {

 private alertService = inject(AlertService);


  email = '';

  constructor(private usr: UserServiceService, private router: Router){}

  

  recuperarPassword() {
    console.log("Email ingresado:", this.email);
    // Llama al servicio con el email
    this.usr.recuperarPassword({ email: this.email }).subscribe({
      next: (respuesta) => {
        console.log('Respuesta del backend:', respuesta);
this.alertService.showSuccess('Succes','Email enviado');
        this.router.navigate(["/cambiopassword"]);


      },
      error: (err) => {
        console.error('Error al recuperar contraseña:', err);
        const msg = err.err?.Mensaje;
        this.alertService.showError('Error',msg);
      }
    });

}
}
