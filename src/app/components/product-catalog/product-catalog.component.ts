import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/Product.interface';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { Category } from '../../interfaces/Category.interface';
import { Brand } from '../../interfaces/Brand.interface';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getProductList()
    this.getCategoryList()
    //this.getBrandList()
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

  // toggleBrand(brandId: number) {
  //   const index = this.selectedBrandIds.indexOf(brandId);

  //   if (index > -1)
  //     this.selectedBrandIds.splice(index, 1);
  //   else
  //     this.selectedBrandIds.push(brandId);
    
  //   this.applyFilters();
  // }
  
  applyFilters() {
    this.filteredProductList = this.productList.filter(product => {
      const matchesCategory =
        this.selectedCategoryIds.length === 0 || this.selectedCategoryIds.includes(product.category.id);
      // const matchesBrand =
      //   this.selectedBrandIds.length === 0 || this.selectedBrandIds.includes(product.brand.id);
      //return matchesCategory && matchesBrand;
      return matchesCategory;
    });
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

  // API PHP CON MODELO MARCA (NO HAY MARCA EN API DE PRUEBA)
  // getBrandList() {
  //   this.productService.getBrands()
  //   .subscribe({
  //     next: data => {
  //       this.brandList = data as Brand[]
  //       console.log('BRANDS: ' + this.brandList)
  //     },
  //     error: err => {
  //       console.error(err)
  //     }
  //   })
  // }
}