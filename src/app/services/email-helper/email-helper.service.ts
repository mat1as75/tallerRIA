import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { OrderConfirmation } from '../../interfaces/OrderConfirmation.interface';
import { EmailContact } from '../../interfaces/EmailContact.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailHelperService {
  private apiphp = environment.apiphp

  constructor(private http: HttpClient) { }

  sendEmail(data: OrderConfirmation) {
    return this.http.post<any>(`${this.apiphp}/pedidos/enviarConfirmacionEmail`, data)
  }

  // data = ID_Pedido, Email, Nombre
  sendEmailPaymentConfirmation(data: any) {
    return this.http.post<any>(`${this.apiphp}/pedidos/enviarConfirmacionPagoEmail`, data)
  }

  sendEmailContact(data: EmailContact) {
    return this.http.post<any>(`${this.apiphp}/enviarContacto`, data)
  }
}
