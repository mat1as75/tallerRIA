import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showError(title: string, text: string) {
    Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#d33'
    });
  }

  showSuccess(title: string, text: string) {
    Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#3085d6'
    });
  }

  showWarning(title: string, text: string) {
    Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonColor: '#f0ad4e'
    });
  }

  showInfo(title: string, text: string) {
    Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonColor: '#17a2b8'
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

}
