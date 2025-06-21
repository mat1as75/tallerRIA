import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from '../../services/cookies/cookie.service';
import { UserServiceService } from '../../services/user/user-service.service';
import { Pedido } from '../../interfaces/Pedido.interface';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { AlertService } from '../../services/alert/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historia-compras',
  imports: [RouterLink, CommonModule, NgFor,NgIf],
  templateUrl: './historia-compras.component.html',
  styleUrl: './historia-compras.component.scss'
})
export class HistoriaComprasComponent {


  private alertService = inject(AlertService);


  compras: Pedido[]=[];


constructor(private router: Router, private servicecookie: CookieService, private userservice: UserServiceService){}



 ngOnInit(): void {
  const session = this.servicecookie.getCookie('session_ID');

  if (!session) {
    console.warn("No hay cookie de sesión");
    this.alertService.showWarning('Warning','No tiene cookie Registrada. \nDebe iniciar sesion')
    this.router.navigate(['/login']);
    return;
  }

  this.userservice.ObtenerCompras(session).subscribe({
    next: (compraData: Pedido []) => {
      this.compras = (compraData as any)["pedidos"];// Asegurate de tener la propiedad `compras: Pedido | null = null;`
      console.log("Pedidos del usuario:", compraData);
    },
    error: (err) => {
      console.error("Error al obtener el usuario:", err);
       // Opcional: redirigir si falla
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
      this.alertService.AlertTopCorner('Cerrado','Cerraste sesion')
      this.router.navigate(['/home']);
    },
    error: (err) => {
      console.error('Error al cerrar sesión', err);
      this.alertService.showError('Error','Error al cerrar sesion')
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

  
this.borraruser(sessionId);



 }




   borraruser(sessionId: any){
     const swalWithBootstrapButtons = Swal.mixin({
   customClass: {
     confirmButton: "btn btn-success",
     cancelButton: "btn btn-danger"
   },
   buttonsStyling: false
 });
 swalWithBootstrapButtons.fire({
   title: "Esta seguro?",
   text: "No es revercible",
   icon: "warning",
   showCancelButton: true,
   confirmButtonText: "Dar de baja",
   cancelButtonText: "Cancelar!",
   reverseButtons: true
 }).then((result) => {
   if (result.isConfirmed) {
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
       swalWithBootstrapButtons.fire({
       title: "Deleted!",
       text: "Usuario dado de baja",
       icon: "success"
     });
     }
   });
 
     
   } else if (
     /* Read more about handling dismissals below */
     result.dismiss === Swal.DismissReason.cancel
   ) {
     swalWithBootstrapButtons.fire({
       title: "Cancelado",
       text: "Se cancelo la desactivasion del usuario",
       icon: "error"
     });
   }
 });
   }


}

