import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../../interfaces/Order.interface';
import { OrderConfirmation } from '../../interfaces/OrderConfirmation.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiphp = environment.apiphp;

  constructor(private http: HttpClient) { }

  createOrder(data: Order) {
    return this.http.post<OrderConfirmation>(`${this.apiphp}/pedidos`, data)
  }

  downloadOrderPDF(data: any): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post(`${this.apiphp}/pedidos/descargarPDF`, data, {
      headers,
      responseType: 'blob' as const
    });
  }

}
