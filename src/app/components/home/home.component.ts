import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../interfaces/Product.interface';
import { ProductService } from '../../services/product/product.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  images = [
    'assets/banner1.jpg',
    'assets/banner2.jpg',
    'assets/banner3.jpg',
  ];
  currentIndex = 0;
  intervalId: any;

  bestsellers: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.startAutoSlide();
    this.loadBestsellers();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  resetAutoSlide() {
    clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.resetAutoSlide();
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.resetAutoSlide();
  }

  loadBestsellers() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.bestsellers = products.slice(1, 6);
      },
      error: (err) => {
        console.error('Error al cargar productos: ', err);
      }
    });
  }

  viewProduct(id: number) {
    this.router.navigate(['/producto', id]);
  }
}
