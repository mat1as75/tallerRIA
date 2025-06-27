import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserServiceService } from '../../services/user/user-service.service'; 


@Component({

  selector: 'app-gestor-update',
  imports: [NavbarComponent, FormsModule],
  templateUrl: './gestor-update.component.html',
  styleUrl: './gestor-update.component.scss'

})

export class GestorUpdateComponent {

  gestor = {

    Email: '',
    Nombre: '',
    Apellido: '',
    Password: '',
    Rol: 'gestor',
    p_producto: false,
    p_inventario: false,
    p_pedidos: false,
    p_validacion: false,
    p_soporte: false
     
  };

  constructor(private http: HttpClient, private router: Router) {}
  
  usrS = inject(UserServiceService);

  enviarFormulario() {
  
        console.log('Payload que se enviará:', this.gestor);
  
        this.usrS.postModifciarGestor(this.gestor).subscribe({
          next: (usuarioRes) => {;
  
            console.log('Gestor modificado:', usuarioRes);
            
            Swal.fire({
  
              title: '¡Gestor modificado!',
              text: 'El gestor fue modificado con sus nuevos permisos! ',
              icon: 'success',
              confirmButtonText: 'Aceptar'      
  
            });
            
          },
          error: (err: unknown) => {
            console.error('Error al modificar el gestor:', err);
  
            //SWEETALERT
            Swal.fire({
  
              title: 'Error',
              text: 'No se pudo modificar el gestor. Verifica el Email ingresado.',
              icon: 'error',
              confirmButtonText: 'Cerrar'
  
            });
  
          }
  
        }); 
  
      }
  
  
    limpiarFormulario() {

      this.gestor = {

        Email: '',
        Nombre: '',
        Apellido: '',
        Password: '',
        Rol: 'gestor',
        p_producto: false,
        p_inventario: false,
        p_pedidos: false,
        p_validacion: false,
        p_soporte: false

      };

    }
  
    cancelar() {
  
      this.router.navigate(['/']);
  
    }

}
