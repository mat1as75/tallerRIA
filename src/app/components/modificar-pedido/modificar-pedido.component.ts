import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Router,RouterLink } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderService } from '../../services/order/order.service'; 

import { FormGroup, FormControl, Validators } from '@angular/forms';

//INTERFACES
import { ShippingInfo } from '../../interfaces/ShippingInfo.interface';
import { UserServiceService } from '../../services/user/user-service.service';
import { Order } from '../../interfaces/Order.interface';
import { EmailHelperService } from '../../services/email-helper/email-helper.service';

@Component({
  selector: 'app-modificar-pedido',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './modificar-pedido.component.html',
  styleUrl: './modificar-pedido.component.scss'
})


export class ModificarPedidoComponent implements OnInit{

  //variables de la pagina:

  //form
  formReactivo: FormGroup;

  DatosEnvio : ShippingInfo | null = null;

  idPedido : number = 0;

  Estado = "";
  
  TelefonoCliente : String = "";
  DireccionCliente : String = "";
  DepartamentoCliente : String = "";
  CiudadCliente : String = "";

  payload = {
    Estado: "",
  }

  pedidoInfo?: Order
  dataCliente: any = {
    ID_Pedido: 0,
    Email: '',
    Nombre: ''
  }

  constructor(
  
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private OrderService: OrderService,
    private userService: UserServiceService,
    private emailHelper: EmailHelperService
  
  ){


    //FORM PRECARGA
    this.formReactivo = new FormGroup({

      TelefonoCliente: new FormControl('', Validators.required),
      DireccionCliente: new FormControl('', Validators.required),
      DepartamentoCliente: new FormControl('', Validators.required),
      CiudadCliente: new FormControl('', Validators.required),
      Estado: new FormControl('', Validators.required)

    });



  }

  ngOnInit(): void {

    const pedidoid = this.route.snapshot.paramMap.get('id');

    if (pedidoid) {
      this.obtenerPedido(pedidoid);
    }

  
  }


  //OBTENEMOS PEDIDO
  obtenerPedido(id: String) {
    this.OrderService.getPedidoById(+id).subscribe({
      next: (data) => {


        console.log('Pedido recibido:', data);

        console.log('id datosenvio:', data.ID_DatosEnvio);

        //ASIGNAMOS id del pedido
        this.idPedido = data.ID;

        this.payload.Estado = data.Estado;
        

        //llamar request para obtener datos envio
        this.OrderService.getDatosEnvioById(+data.ID_DatosEnvio).subscribe({
          next: (data2) => {

            console.log('DatosEnvio recibido:', data2);

            console.log('DatosEnvio recibido:', data2.TelefonoCliente);


            //cargamos el form
            this.formReactivo.patchValue({

              TelefonoCliente: data2.TelefonoCliente,
              DireccionCliente: data2.DireccionCliente,
              DepartamentoCliente: data2.DepartamentoCliente,
              CiudadCliente: data2.CiudadCliente,

              Estado: data.Estado
              

            });

          },

          error: (err) =>{

            console.error('Error al obtener los datos de envio', err);
            Swal.fire('Error', 'No se pudo cargar los datos de envio.', 'error');

          }

        });

      },

      error: (err) => {
        console.error('Error al obtener el Pedido', err);
        Swal.fire('Error', 'No se pudo cargar el Pedido.', 'error');
      }

    });

  }




  cancelar() {
    this.router.navigate(['/listaPedido']);
  }
  
  enviarFormulario() {
    

    const estadoActual = this.formReactivo.get('Estado')?.value;

    console.log('Payload que se enviará: Estado: ', estadoActual , " ID del pedido: ", this.idPedido );

    this.payload.Estado = estadoActual;
    
    this.OrderService.updateEstadoPedido(this.idPedido,this.payload).subscribe({
      next: (data3) => {;
    
        console.log('Pedido modificado:', data3);
        
        if (this.payload.Estado === 'entregado') {
          this.dataCliente.ID_Pedido = this.idPedido
          console.log('SEND ', this.dataCliente)
          this.getInfoClienteAndSendEmail()
        }
          
             
        Swal.fire({
    
          title: 'Pedido modificado!',
          text: 'El Pedido fue modificado con su nuevo Estado! ',
          icon: 'success',
          confirmButtonText: 'Aceptar'      
    
        });

        this.router.navigate(['/listaPedido'])
              
      },
      error: (err: unknown) => {
        console.error('Error al modificar el Pedido:', err);
   
        //SWEETALERT
       Swal.fire({
    
          title: 'Error',
          text: 'No se pudo modificar el Pedido. ',
          icon: 'error',
          confirmButtonText: 'Cerrar'
    
        });
    
      }
    
    }); 
    
  }

  sendEmailPaymentConfirmation() {
    this.emailHelper.sendEmailPaymentConfirmation(this.dataCliente).subscribe({
      next: (data) => {
        console.log('DATOS: ', this.dataCliente)
        console.log('RESPONSE EMAIL DATA: ', data)
      },
      error: (err) => {
        console.error('Error al enviar mail', err)
      }
    })
  }

  getInfoClienteAndSendEmail() {
    this.OrderService.getOrderById(this.idPedido).subscribe({
      next: (pedido) => {
        const idCliente = pedido.ID_Cliente

        this.userService.ObtenerUsuario(String(idCliente)).subscribe({
          next: (cliente) => {
            this.dataCliente.Nombre = cliente.Nombre
            this.dataCliente.Email = cliente.Email

            this.sendEmailPaymentConfirmation()
          },
          error: (err) => {
            console.error('Error al obtener usuario', err)
          }
        })
      },
      error: (err) => {
        console.error('Error al obtener pedido', err)
      }
    })
  }
    
  
  
  
  
}
