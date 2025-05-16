import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';
import { ProductService } from './services/http/product.service';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductCatalogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'tallerRIA';

  productService = inject(ProductService)
  router = inject(Router)

  constructor() {
    console.log(environment.apiUrl)
  }

  ngOnInit(): void {
      
  }
}
