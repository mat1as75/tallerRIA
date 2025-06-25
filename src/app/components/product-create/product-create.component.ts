import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { Category } from '../../interfaces/Category.interface';
import { Brand } from '../../interfaces/Brand.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})

export class ProductCreateComponent {
  
  formReactivo: FormGroup;
  nombre: FormControl;
  precio: FormControl;
  stock: FormControl;
  marca: FormControl;
  categoria: FormControl;
  descripcion: FormControl;

  exito: string = '';
  error: string = '';
  activarMensaje: boolean = false;
  categorias: Category[] = [];
  marcas: Brand[] = [];
  imagenBase64: string = '';
  //TODO ver como se va a trabajar las imagenes ya que están como string en la bd y no base64

  constructor(private servicioAPI: ProductService) {
    this.nombre = new FormControl('', Validators.required);
    this.precio = new FormControl('', Validators.required);
    this.stock = new FormControl('', Validators.required);
    this.marca = new FormControl('', Validators.required);
    this.categoria = new FormControl('', Validators.required);
    this.descripcion = new FormControl('', Validators.required);
    this.formReactivo = new FormGroup({
      nombre: this.nombre,
      precio: this.precio,
      stock: this.stock,
      marca: this.marca,
      categoria: this.categoria,
      descripcion: this.descripcion,
    })
  }

  ngOnInit() {
    this.servicioAPI.getCategories().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías', err)
    });

    this.servicioAPI.getBrands().subscribe({
    next: (data) => this.marcas = data,
    error: (err) => console.error('Error al cargar marcas', err)
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

    const nuevoProducto = {
      Nombre: this.nombre.value,
      Precio: this.precio.value,
      Stock: this.stock.value,
      ID_Marca: this.marca.value,
      ID_Categoria: this.categoria.value,
      Descripcion: this.descripcion.value,
      URL_Imagen: this.imagenBase64
    };
    console.log(nuevoProducto);

    this.servicioAPI.createProduct(nuevoProducto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Producto creado',
          text: 'El producto se creó correctamente.'
        });
        this.formReactivo.reset();
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo crear el producto. Intenta nuevamente.'
        });
      }
    });
  }

}