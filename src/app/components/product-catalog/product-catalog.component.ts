import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/Product.interface';
import { Router } from '@angular/router';
import { Category } from '../../interfaces/Category.interface';
import { Brand } from '../../interfaces/Brand.interface';
import { FormsModule } from '@angular/forms';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSliderModule],
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

  lowerAndHigherPrice = this.getMinAndMaxPriceProducts(this.productList);
  minPrice?: number = this.lowerAndHigherPrice.min?.Precio ? parseFloat(this.lowerAndHigherPrice.min.Precio) : 0;
  maxPrice?: number = this.lowerAndHigherPrice.max?.Precio ? parseFloat(this.lowerAndHigherPrice.max.Precio) : 100;

  options: Options = {
    floor: 0,
    ceil: 100,
    step: 1,
    translate: (value: number): string => {
      return 'USD ' + value
    }
  }

  sliderRange: any = {
    minValue: this.minPrice,
    maxValue: this.maxPrice,
    options: this.options,
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.getProductList()
    this.getCategoryList()
    this.getBrandList()
  }

  onPriceRangeChange() {
    this.applyFilters()
  }

  getMinAndMaxPriceProducts(products: Product[]) {
    if (products.length === 0) return { min: null, max: null };

    const initial = { min: products[0], max: products[0] };

    return products.reduce((acc, product) => {
      const price = parseFloat(product.Precio);

      const minPrice = parseFloat(acc.min.Precio);
      const maxPrice = parseFloat(acc.max.Precio);

      if (price < minPrice) acc.min = product;
      if (price > maxPrice) acc.max = product;

      return acc;
    }, initial);
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
      const price = parseFloat(product.Precio)

      const matchesCategory =
        this.selectedCategoryIds.length === 0 || this.selectedCategoryIds.includes(product.ID_Categoria);
      const matchesBrand =
        this.selectedBrandIds.length === 0 || this.selectedBrandIds.includes(product.ID_Marca);
      const matchesPrice = 
        price >= this.sliderRange.minValue && price <= this.sliderRange.maxValue;
    
      return matchesCategory && matchesBrand && matchesPrice;
    });

    switch (this.sortOption) {
      case 'nameAZ':
        result.sort((a, b) => a.Nombre.localeCompare(b.Nombre));
        break;
      case 'nameZA':
        result.sort((a, b) => b.Nombre.localeCompare(a.Nombre));
        break;
      case 'higherPrice':
        result.sort((a, b) => parseFloat(b.Precio) - parseFloat(a.Precio));
        break;
      case 'lowerPrice':
        result.sort((a, b) => parseFloat(a.Precio) - parseFloat(b.Precio));
        break;
    }

    this.filteredProductList = result;
  }

  trackByProducts(index: number, product: Product): number { return product.ID; } 

  getProductList() {
    this.productService.getProducts()
    .subscribe({
      next: data => {
        this.productList = data as Product[]
        this.filteredProductList = [...this.productList]
         // Ahora sí: calcular min y max una vez que ya tenemos productos
         const priceExtremes = this.getMinAndMaxPriceProducts(this.productList)
         this.minPrice = priceExtremes.min ? parseFloat(priceExtremes.min.Precio) : 0
         this.maxPrice = priceExtremes.max ? parseFloat(priceExtremes.max.Precio) : 100
 
         // Actualizar opciones del slider
         this.options = {
           ...this.options,
           floor: this.minPrice,
           ceil: this.maxPrice,
         }
 
         this.sliderRange = {
           minValue: this.minPrice,
           maxValue: this.maxPrice,
           options: this.options,
         }
 
         console.log('PRODUCTS:')
         this.productList.forEach((product: Product) =>
           console.log(product.ID + ' - ' + product.Nombre + ' - ' + product.ID_Categoria + ' - ' + product.ID_Marca)
         )
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
        console.log('CATEGORIES:')
        this.categoryList.forEach((category: Category) => console.log(category.ID + ' - ' + category.Nombre))
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
        console.log('BRANDS:')
        this.brandList.forEach((brand: Brand) => console.log(brand.ID + ' - ' + brand.Nombre))
      },
      error: err => {
        console.error(err)
      }
    })
  }
}