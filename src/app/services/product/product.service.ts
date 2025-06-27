import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../interfaces/Product.interface';
import { Category } from '../../interfaces/Category.interface';
import { Brand } from '../../interfaces/Brand.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiphp = environment.apiphp;

  categories: Category[] = [];
  brands: Brand[] = [];

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiphp}/productos`).pipe(
      map((productos) => {
        return productos.map(product => {
          // Convertir Precio a número explícitamente
          product.Precio = parseFloat(product.Precio as any);

          const marca = this.brands.find(b => b.ID === product.ID_Marca);
          product.Marca = marca ? marca.Nombre : 'Desconocida';

          const categoria = this.categories.find(c => c.ID === product.ID_Categoria);
          product.Categoria = categoria ? categoria.Nombre : 'Desconocida';

          return product;
        });
      })
    );
  }

  getProductById(id: number) {
    return this.http.get<Product>(`${this.apiphp}/productos/${id}`)
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiphp}/categorias`).pipe(
      map(categories => {
        this.categories = categories;
        return categories;
      })
    );

  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiphp}/marcas`).pipe(
      map(brands => {
        this.brands = brands;
        return brands;
      })
    );
  }

  createProduct(product: Omit<Product, 'ID' | 'CreatedAt'>) {
    return this.http.post(`${this.apiphp}/productos`, product);
  }

  getCategoryById(id: number) {
    return this.http.get<Category>(`${this.apiphp}/categorias/${id}`)
  }

  // getBrands() {
  //   return this.http.get<Brand[]>(`${this.apiphp}/marcas`) 
  // }

  updateProduct(id: number, product: Omit<Product, 'ID'>) {
    return this.http.put(`${this.apiphp}/productos/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiphp}/productos/${id}`);
  }

  updateProduct(id: number, product: Omit<Product, 'ID'>) {
    return this.http.put(`${this.apiphp}/productos/${id}`, product);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiphp}/productos/${id}`);
  }

  /*updateStock(id: number, nuevoStock: number) {
    return this.http.patch(`${this.apiphp}/productos/${id}/stock`, {
      nuevo_stock: nuevoStock
    });
  }*/

  subirImagen(formData: FormData) {
    return this.http.post(`${this.apiphp}/productos/imagen`,formData);
  }

}
