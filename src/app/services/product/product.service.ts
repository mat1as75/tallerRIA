import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../interfaces/Product.interface';
import { Category } from '../../interfaces/Category.interface';
import { Brand } from '../../interfaces/Brand.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`)
  }

  // getBrands() {
  //   return this.http.get<Brand[]>(`${this.apiUrl}/brands`) 
  // }
}
