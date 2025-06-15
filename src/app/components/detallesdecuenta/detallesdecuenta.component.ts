import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgModel } from '@angular/forms';
import { CookieService } from '../../services/cookies/cookie.service';
import { UserServiceService } from '../../services/user/user-service.service';
import { User } from '../../interfaces/User.interface';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';


@Component({
  selector: 'app-detallesdecuenta',
  imports: [FormsModule, NavbarComponent, RouterLink],
  templateUrl: './detallesdecuenta.component.html',
  styleUrl: './detallesdecuenta.component.scss'
})
export class DetallesdecuentaComponent {
  usuario: User | null = null; 

  usuario: User | null = null; 

  
  passwordActual: string = '';
  passwordNueva: string = '';
  confirmarPassword: string = '';



constructor(private router: Router, private servicecookie: CookieService, private userservice: UserServiceService){}



 ngOnInit(): void {
  const session = this.servicecookie.getCookie('session_ID');

  if (!session) {
    console.warn("No hay cookie de sesión");
    this.router.navigate(['/login']);
    return;
  }

  this.userservice.ObtenerUsuario(session).subscribe({
    next: (userData) => {
      this.usuario = userData; // Asegurate de tener la propiedad `usuario: User | null = null;`
      console.log("Datos del usuario:", userData);
    },
    error: (err) => {
      console.error("Error al obtener el usuario:", err);
      this.router.navigate(['/login']); // Opcional: redirigir si falla
    }
  });
 }


 cerrarsesion() {
  const sessionId = this.servicecookie.getCookie('session_ID');




  this.userservice.cerrarsesion(sessionId!).subscribe({
    next: (res) => {
      console.log('Sesión cerrada correctamente', res);
        // Limpiar almacenamiento local
        this.servicecookie.borrarCookie('session_ID');
        this.servicecookie.borrarCookie('PHPSESSID');
      // Redirigir al login
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Error al cerrar sesión', err);
    },
    complete: () => {
      console.log('Request de cierre de sesión completado.');
    }
  });

 }


 desactivacuenta(){

  const sessionId = this.servicecookie.getCookie('session_ID');

  // Limpiar almacenamiento local
  localStorage.clear();
  sessionStorage.clear();

  this.userservice.deleteuser(sessionId!).subscribe({
    next: (res) => {
      console.log('Sesión dado de baja correctamente', res);

      // Redirigir al login
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Error al dar de baja usuario', err);
    },
    complete: () => {
      console.log('Request de dar de baja Usuario completado.');
    }
  });


 }



cambiopass() {
  if (!this.usuario || !this.usuario.Email) {
    alert("El usuario no está cargado aún. Por favor, esperá unos segundos o recargá la página.");
    return;
  }

  if (this.passwordNueva !== this.confirmarPassword) {
    alert('Las contraseñas nuevas no coinciden');
    return;
  }

  const data = {
    email: this.usuario.Email,
    password: this.passwordActual,
    nuevapass: this.passwordNueva
  };

  this.userservice.cambiopassDetalle(data).subscribe({
    next: (res) => {
      console.log('Contraseña cambiada correctamente', res);
      alert('Contraseña actualizada con éxito');
      // Opcional: limpiar campos
      this.passwordActual = '';
      this.passwordNueva = '';
      this.confirmarPassword = '';
    },
    error: (err) => {
      console.log('DATOS:', data);
      console.error('Error al cambiar la contraseña', err);
      alert('Ocurrió un error al cambiar la contraseña');
    }
  });
}


}






