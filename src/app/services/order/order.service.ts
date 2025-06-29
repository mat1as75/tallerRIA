import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from '../../interfaces/Order.interface';
import { OrderConfirmation } from '../../interfaces/OrderConfirmation.interface';
import { Observable } from 'rxjs';
import { Product } from '../../interfaces/Product.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiphp = environment.apiphp;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiphp}/pedidos`)
  }

  getOrderById(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiphp}/pedidos/${id}`)
  }

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

  getProductsByOrderId(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiphp}/productos/pedido/${id}`)
  }

}
