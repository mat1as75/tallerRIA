import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpService } from '../../services/http/http.service';

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.scss'
})

export class ProductCreateComponent {

  formReactivo: FormGroup;
  nombre: FormControl;
  precio: FormControl;
  stock: FormControl;
  marca: FormControl;
  categoria: FormControl;
  descripcion: FormControl;
  imagen: FormControl;

  exito: string = '';
  error: string = '';
  activarMensaje: boolean = false;

  constructor(private servicioAPI: HttpService) {
    this.nombre = new FormControl('', Validators.required);
    this.precio = new FormControl('', Validators.required);
    this.stock = new FormControl('', Validators.required);
    this.marca = new FormControl('', Validators.required);
    this.categoria = new FormControl('', Validators.required);
    this.descripcion = new FormControl('', Validators.required);
    this.imagen = new FormControl('', Validators.required);
    this.formReactivo = new FormGroup({
      nombre: this.nombre,
      precio: this.precio,
      stock: this.stock,
      marca: this.marca,
      categoria: this.categoria,
      descripcion: this.descripcion,
      imagen: this.imagen
    })
  }

  onSubmit() {
    //TODO Añadir conexion con la api
  }

}