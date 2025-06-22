import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private router : Router) { }

  showError(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      showConfirmButton: true,
      confirmButtonColor: '#d33',
      customClass: {
        confirmButton: 'rounded-pill'}
    });
  }

  showSuccess(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#2c007f',
    });
  }

  showWarning(title: string, text: string) {
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#2c007f'
    });
  }

  showInfo(title: string, text: string) {
    Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: '#2c007f'
    });
  }

  showProcessing(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });
  }

  closeAlert() {
    Swal.close()
  }

  AlertTopCorner(title: string, text: string){
    Swal.fire({
      position: "top-end",
      icon: 'success',
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 1500
    });
  }

  AlertProductAddedToCart(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#2c007f',
      showConfirmButton: true,
      confirmButtonText: 'Ir al carrito',
      showCancelButton: true,
      cancelButtonText: 'Seguir comprando',
      customClass: {
        confirmButton: 'rounded-pill',
        cancelButton: 'rounded-pill'
      },
    }).then((result) => {
      if (result.isConfirmed)
        this.router.navigate(['/carrito'])
      else
        this.router.navigate(['/catalogo'])
    })
  }

}
