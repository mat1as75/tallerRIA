import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/Product.interface';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss'
})
export class ProductCatalogComponent implements OnInit {

  productService = inject(ProductService)
  
  productsList: Product[] = []

  /* PRUEBA */
  categoryList = ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4', 'Categoria 5'];
  brandList = ['Marca 1', 'Marca 2', 'Marca 3', 'Marca 4', 'Marca 5'];

  constructor() {}

  ngOnInit(): void {
    this.getProductsList()    
  }

  trackByProducts(index: number, product: Product): number { return product.id; } 

  getProductsList() {
    this.productService.getProducts()
    .subscribe({
      next: data => {
        this.productsList = data as Product[]
      },
      error: err => {
        console.error(err)
      }
    })
  }
}