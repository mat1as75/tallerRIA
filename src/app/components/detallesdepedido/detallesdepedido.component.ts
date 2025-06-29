import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../services/alert/alert.service';
import { CookieService } from '../../services/cookies/cookie.service';
import { UserServiceService } from '../../services/user/user-service.service';
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Pedido } from '../../interfaces/Pedido.interface';
import { Product } from '../../interfaces/Product.interface';
import { ProductService } from '../../services/product/product.service';
import { OrderService } from '../../services/order/order.service';

@Component({
  selector: 'app-detallesdepedido',
  imports: [RouterLink, NgFor, NgIf,CurrencyPipe,DatePipe],
  templateUrl: './detallesdepedido.component.html',
  styleUrl: './detallesdepedido.component.css'
})
export class DetallesdepedidoComponent {

private alertService = inject(AlertService);

  product: Product []=[];

  pedido: Pedido | null = null;

  pedidoId!: number;

constructor(private route: ActivatedRoute,
  private router: Router, 
  private servicecookie: CookieService, 
  private userservice: UserServiceService, 
  private pedidoService: OrderService){}



 ngOnInit(): void {
  this.pedidoId = Number(this.route.snapshot.paramMap.get('id'));

  this.cargarPedido(this.pedidoId);

  this.CargarProductos(this.pedidoId);

}


  CargarProductos(id: number){
    this.pedidoService.ObtenerProductosdePedido(id).subscribe({
  next:(res: Product[])=>{
    console.log("se obtuvieron los Productos del pedido");
    this.product = res;
  },
  error: err =>{
    console.error("ERROR AL OBRENER PRODUCTOS:", err);
  }
}) 
  }


   cargarPedido(id: number) {
    const session = this.servicecookie.getCookie('session_ID');
    this.pedidoService.ObtenerPedidoporID(id).subscribe({
      next: (res: Pedido) => {
        console.log('Pedido recibido:', res);
        this.pedido = res; // o adaptar a lo que necesites
        
      },
      error: err => {
        console.error('Error al obtener el pedido:', err);
        // Puedes redirigir o mostrar error
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
