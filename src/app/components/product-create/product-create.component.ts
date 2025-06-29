import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product/product.service';
import { Category } from '../../interfaces/Category.interface';
import { Brand } from '../../interfaces/Brand.interface';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
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
  rutaImagen: string = '';
  archivoSeleccionado: File | null = null;
  imagenPreview: string | ArrayBuffer | null = null;
  @ViewChild('inputFile') inputFile!: ElementRef;


  constructor(private servicioAPI: ProductService, private router: Router) {
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
    if (file) {
      this.archivoSeleccionado = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

 subirImagen(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!this.archivoSeleccionado) {
      return resolve(''); 
    }

    const formData = new FormData();
    formData.append('imagen', this.archivoSeleccionado); 

    this.servicioAPI.subirImagen(formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          resolve(response.file);
        } else {
          reject('No se pudo subir la imagen');
        }
      },
      error: (err) => {
        console.error('Error al subir imagen', err);
        reject('Error al subir imagen');
      }
    });
  });
}

onCancel() {
  this.router.navigate(['/listaProductos'])
}

async onSubmit() {
  if (this.formReactivo.invalid) {
    Swal.fire({
      icon: 'warning',
      title: 'Formulario incompleto',
      text: 'Por favor completá todos los campos.'
    });
    return;
  }

  try {
    const imagenUrl = await this.subirImagen();

    const nuevoProducto = {
      Nombre: this.formReactivo.value.nombre,
      Precio: this.formReactivo.value.precio,
      Stock: this.formReactivo.value.stock,
      ID_Marca: this.formReactivo.value.marca,
      ID_Categoria: this.formReactivo.value.categoria,
      Descripcion: this.formReactivo.value.descripcion,
      URL_Imagen: imagenUrl,
      Cantidad: Number('')
    };

    this.servicioAPI.createProduct(nuevoProducto).subscribe({
      next: () => {
        Swal.fire('Producto creado', 'El producto se creó correctamente.', 'success');
        this.formReactivo.reset();
        this.imagenPreview = null;
        this.rutaImagen = '';
        this.archivoSeleccionado = null;
        this.inputFile.nativeElement.value = '';
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo crear el producto. Intenta nuevamente.', 'error');
      }
    });

  } catch (err) {
    Swal.fire('Error', 'No se pudo subir la imagen.', 'error');
  }
}


}