import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CartProduct } from '../../interfaces/CartProduct.interface';
import { ShippingInfo } from '../../interfaces/ShippingInfo.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiphp = environment.apiphp;

  private cartDataSubject = new BehaviorSubject<CartProduct[]>([])
  cartData$ = this.cartDataSubject.asObservable();

  private quantitySubject = new BehaviorSubject<number>(0)
  quantity$ = this.quantitySubject.asObservable()

  private cartData: CartProduct[] = []
  private shippingInfo?: ShippingInfo | null

  constructor(private http: HttpClient) { }

  getCartProducts(clientId: number): Observable<CartProduct[]> {
    return this.http.get<CartProduct[]>(`${this.apiphp}/carritoDetallado/${clientId}`);
  }

  getQuantityProductsCart(sessionId: number) {
    return this.http.get<any>(`${this.apiphp}/carrito/cantidadProductos/${sessionId}`)
  }

  addProductToCart(data: any) {
    return this.http.post<any>(`${this.apiphp}/carrito/agregar`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateQuantity(sessionId: number) {
    this.getQuantityProductsCart(sessionId)
    .subscribe({
      next: (data) => {
        this.quantitySubject.next(data?.COUNT ?? 0);
      },
      error: () => {
        this.quantitySubject.next(0);
      }
    });
  }

  resetQuantity() {
    this.quantitySubject.next(0);
  }

  updateProductQuantity(data: any) {
    return this.http.patch<any>(`${this.apiphp}/carrito/actualizar`, data)
  }

  removeCartProduct(data: any) {
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

  setCartData(data: CartProduct[]) {
    this.cartData = data
    this.cartDataSubject.next(data)
  }

  getCartData(): CartProduct[] {
    return this.cartData
  }

  clearCartData() {
    this.cartData = []
  }

  setShippingInfo(data: any) {
    this.shippingInfo = data
  }

  getShippingInfo(): any | null | undefined {
    return this.shippingInfo
  }

}
