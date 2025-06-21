import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../interfaces/Product.interface';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss'
})
export class ViewProductComponent implements OnInit{

  productService = inject(ProductService)

  productId: number | undefined
  productDetails: Product | undefined

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.productId = parseInt(this.route.snapshot.paramMap.get('id')!);
    console.error('Product ID: ', this.productId);
    this.getProductDetails(this.productId);
  }

  getProductDetails(id: number) {
    this.productService.getProductById(id)
    .subscribe({
      next: data => {
        this.productDetails = data as Product
        console.log(this.productDetails)
      },
      error: err => {
        console.error(err)
      }
    })
  }

}
