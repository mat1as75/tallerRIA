import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserServiceService } from '../../services/user/user-service.service'; 


@Component({
  selector: 'app-alta-gestor',
  imports: [NavbarComponent, FormsModule],
  templateUrl: './alta-gestor.component.html',
  styleUrl: './alta-gestor.component.scss'
})

  export class AltaGestorComponent {

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

      this.usrS.postRegisterGestor(this.gestor).subscribe({
        next: (usuarioRes) => {;

          console.log('Usuario creado:', usuarioRes);
          
          Swal.fire({

            title: '¡Gestor creado!',
            text: 'El nuevo gestor fue registrado exitosamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'      

          });
          
        },
        error: (err: unknown) => {
          console.error('Error al crear usuario:', err);

          //SWEETALERT
          Swal.fire({

            title: 'Error',
            text: 'No se pudo crear el usuario. Verifica los datos ingresados.',
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




















