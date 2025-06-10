import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/Product.interface';
import { Router } from '@angular/router';
import { Category } from '../../interfaces/Category.interface';
import { Brand } from '../../interfaces/Brand.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-catalog.component.html',
  styleUrl: './product-catalog.component.scss'
})
export class ProductCatalogComponent implements OnInit {

  productService = inject(ProductService)

  selectedCategoryIds: number[] = []
  selectedBrandIds: number[] = []
  
  productList: Product[] = []
  filteredProductList: Product[] = []

  categoryList: Category[] = []
  brandList: Brand[] = []

  sortOption: string = 'nameAZ'; // Default value option

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getProductList()
    this.getCategoryList()
    this.getBrandList()
  }

  viewProduct(id: number) {
    this.router.navigate(['/producto', id])
  }

  toggleCategory(categoryId: number) {
    const index = this.selectedCategoryIds.indexOf(categoryId);
  
    if (index > -1)
      this.selectedCategoryIds.splice(index, 1);
    else
      this.selectedCategoryIds.push(categoryId);
  
    this.applyFilters();
  }

  toggleBrand(brandId: number) {
    const index = this.selectedBrandIds.indexOf(brandId);

    if (index > -1)
      this.selectedBrandIds.splice(index, 1);
    else
      this.selectedBrandIds.push(brandId);
    
    this.applyFilters();
  }
  
  applyFilters() {
    let result = this.productList.filter(product => {
      const matchesCategory =
        this.selectedCategoryIds.length === 0 || this.selectedCategoryIds.includes(product.category.id);
      const matchesBrand =
        this.selectedBrandIds.length === 0 || this.selectedBrandIds.includes(product.brand.id);
    
      return matchesCategory && matchesBrand;
    });

    switch (this.sortOption) {
      case 'nameAZ':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'nameZA':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'higherPrice':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'lowerPrice':
        result.sort((a, b) => a.price - b.price);
        break;
    }

    this.filteredProductList = result;
  }

  trackByProducts(index: number, product: Product): number { return product.id; } 

  getProductList() {
    this.productService.getProducts()
    .subscribe({
      next: data => {
        this.productList = data as Product[]
        this.filteredProductList = [...this.productList]
      },
      error: err => {
        console.error(err)
      }
    })
  }

  getCategoryList() {
    this.productService.getCategories()
    .subscribe({
      next: data => {
        this.categoryList = data as Category[]
        console.log('CATEGORIES: ' + this.categoryList)
      },
      error: err => {
        console.error(err)
      }
    })
  }

  getBrandList() {
    this.productService.getBrands()
    .subscribe({
      next: data => {
        this.brandList = data as Brand[]
        console.log('BRANDS: ' + this.brandList)
      },
      error: err => {
        console.error(err)
      }
    })
  }
}