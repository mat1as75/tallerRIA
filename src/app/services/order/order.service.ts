import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Order } from '../../interfaces/Order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiphp = environment.apiphp;

  constructor(private http: HttpClient) { }

  createOrder(data: Order) {
    return this.http.post<Order>(`${this.apiphp}/pedidos`, data)
  }

}
