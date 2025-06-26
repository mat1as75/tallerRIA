import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../interfaces/Product.interface';
import { Brand } from '../../interfaces/Brand.interface';
import { Category } from '../../interfaces/Category.interface';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  imports: [CommonModule, RouterModule]
})
export class ProductListComponent implements OnInit {

  productos: Product[] = [];
  categorias: Category[] = [];
  marcas: Brand[] = [];
  isAscending: boolean = true;
  currentPage: number = 1;
  itemsPerPage: number = 10;


  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    // Cargar marcas y categorías en paralelo y luego obtener productos 
    // para no pisar los suscribe y que no arme sin querer con algun array vacio
    forkJoin([
      this.productService.getCategories(),
      this.productService.getBrands()
    ]).subscribe({
      next: () => {
        this.obtenerProductos();
      },
      error: (err) => console.error('Error cargando categorías o marcas', err)
    });
  }

  obtenerProductos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
      }
    });
  }

  editarProducto(id: number) {
    this.router.navigate(['/editarProducto', id]);
  }

  eliminarProducto(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
            this.obtenerProductos();
          },
          error: (err) => {
            console.error('Error al eliminar producto', err);
            Swal.fire('Error!', 'Hubo un problema al eliminar el producto.', 'error');
          }
        });
      }
    });
  }
    
  getCategoryNameById(id: string | number): string {
    const categoria = this.productService.categories.find(cat => Number(cat.ID) === Number(id));
    return categoria ? categoria.Nombre : 'Sin categoría';
  }

  sortByName() {
    this.isAscending = !this.isAscending;
    this.productos.sort((a, b) => {
      if (this.isAscending) {
        return a.Nombre.localeCompare(b.Nombre);  // A-Z
      } else {
        return b.Nombre.localeCompare(a.Nombre);  // Z-A
      }
    });
  }

  productosPaginados(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.productos.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.productos.length / this.itemsPerPage);
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.productos.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
}
