import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../interfaces/Product.interface';
import { Brand } from '../../interfaces/Brand.interface';
import { Category } from '../../interfaces/Category.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-edit',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  formReactivo: FormGroup;
  productoEditar: Product | null = null;
  imagenBase64: string = '';
  marcas: any[] = [];
  categorias: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.formReactivo = new FormGroup({
      nombre: new FormControl('', Validators.required),
      precio: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      marca: new FormControl('', Validators.required),
      categoria: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    const productoId = this.route.snapshot.paramMap.get('id');
    if (productoId) {
      this.obtenerProducto(productoId);
    }

    this.productService.getCategories().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });

    this.productService.getBrands().subscribe({
      next: (data) => this.marcas = data,
      error: (err) => console.error('Error al cargar marcas', err)
    });
  }

  obtenerProducto(id: string) {
    this.productService.getProductById(+id).subscribe({
      next: (producto: Product) => {
        console.log('Producto recibido:', producto);
        this.productoEditar = producto;
        this.formReactivo.patchValue({
          nombre: producto.Nombre,
          precio: producto.Precio,
          stock: producto.Stock,
          marca: producto.ID_Marca,
          categoria: producto.ID_Categoria,
          descripcion: producto.Descripcion
        });
        this.imagenBase64 = producto.URL_Imagen;
      },
      error: (err) => {
        console.error('Error al obtener el producto', err);
        Swal.fire('Error', 'No se pudo cargar el producto.', 'error');
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenBase64 = reader.result as string;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.formReactivo.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completá todos los campos.'
      });
      return;
    }

    const datosProducto = {
      Nombre: this.formReactivo.value.nombre,
      Precio: this.formReactivo.value.precio,
      Stock: this.formReactivo.value.stock,
      ID_Marca: this.formReactivo.value.marca,
      ID_Categoria: this.formReactivo.value.categoria,
      Descripcion: this.formReactivo.value.descripcion,
      URL_Imagen: this.imagenBase64
    };

    if (this.productoEditar && this.productoEditar.ID) {
      this.productService.updateProduct(this.productoEditar.ID, datosProducto).subscribe({
        next: () => {
          Swal.fire('Producto actualizado', 'El producto se ha actualizado correctamente.', 'success');
        },
        error: (err) => {
          console.error('Error al actualizar el producto', err);
          Swal.fire('Error', 'Hubo un problema al actualizar el producto.', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'No se pudo obtener el producto para editar.', 'error');
    }
  }
}
