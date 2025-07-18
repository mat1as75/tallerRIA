import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment.development';
import { ProductService } from './services/product/product.service';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'tallerRIA';

  productService = inject(ProductService)
  router = inject(Router)

  constructor() { }

  ngOnInit(): void {
      
  }
}
