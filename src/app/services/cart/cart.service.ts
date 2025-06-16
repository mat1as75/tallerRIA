import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductCart } from '../../interfaces/ProductCart.interface';
import { ShippingInfo } from '../../interfaces/ShippingInfo.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiphp = environment.apiphp;
  private cartData: ProductCart[] = []
  private shippingInfo?: ShippingInfo | null

  constructor(private http: HttpClient) { }

  getCartProducts(client_id: number) {
    return this.http.get<ProductCart[]>(`${this.apiphp}/carritoDetallado/${client_id}`)
  }

  updateProductQuantity(data: any) {
    return this.http.patch<any>(`${this.apiphp}/carrito/actualizar`, data)
  }

  removeProductCart(data: any) {
    return this.http.request<any>('delete', `${this.apiphp}/carrito/remover`, {
      body: data,
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    })
  }

  clearCart(session_ID: number) {
    return this.http.request<number>('delete', `${this.apiphp}/carrito/vaciar`, {
      body: { ID_Cliente: session_ID },
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    })
  }

  setCartData(data: ProductCart[]) {
    this.cartData = data
  }

  getCartData(): ProductCart[] {
    return this.cartData
  }

  clearCartData() {
    this.cartData = []
  }

  setShippingInfo(data: ShippingInfo) {
    this.shippingInfo = data
  }

  getShippingInfo(): ShippingInfo | null | undefined {
    return this.shippingInfo
  }

}
