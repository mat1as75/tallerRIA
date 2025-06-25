import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Product } from '../../interfaces/Product.interface';
import { ProductService } from '../../services/product/product.service';
import { Category } from '../../interfaces/Category.interface';
import { Router, RouterLink } from '@angular/router';
import { EmailContact } from '../../interfaces/EmailContact.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailHelperService } from '../../services/email-helper/email-helper.service';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private emailHelper = inject(EmailHelperService)
  private alertService = inject(AlertService)

  images = [
    'assets/banner1.jpg', 
    'assets/banner2.jpg', 
    'assets/banner3.jpg',
  ];
  currentIndex = 0;
  intervalId: any;

  bestsellers: Product[] = [];
  categoryList: Category[] = [];

  contactDataForm: FormGroup
  contactInformationForm?: EmailContact

  constructor(
    private productService: ProductService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.contactDataForm = this.formBuilder.group({
      Nombre: this.formBuilder.control('', Validators.required),
      Email: this.formBuilder.control('', Validators.required),
      Asunto: this.formBuilder.control('', Validators.required),
      Mensaje: this.formBuilder.control('', Validators.required)
    })
  }

  ngOnInit() {
    this.startAutoSlide();
    this.loadBestsellers();
    this.getCategoryList();

    this.contactInformationForm = {
      Nombre: '',
      Email: '',
      Asunto: '',
      Mensaje: ''
    }
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
    const selectedIds = [1, 6, 10, 11, 14, 15]; // IDs seleccionados manualmente

    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.bestsellers = products.filter((product) =>
          selectedIds.includes(product.ID)
        )
      },
      error: (err) => {
        console.error('Error al cargar productos: ', err);
      }
    });
  }

  getCategoryList() {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categoryList = data;
        //console.log('Categorías cargadas:', this.categoryList);
      },
      error: (err) => {
        console.error('Error al obtener categorías', err);
      },
    });
  }

  goToCategory(categoryName: string) {
    const category = this.categoryList.find((c) => c.Nombre === categoryName);
    if (category) {
      this.router.navigate(['/catalogo'], {
        queryParams: { categoryId: category.ID },
      });
    } else {
      console.warn(`Categoría "${categoryName}" no encontrada`);
    }
  }

  viewProduct(id: number) {
    this.router.navigate(['/producto', id]);
  }

  onSubmitContact() {
    if (this.contactDataForm.invalid) {
      this.contactDataForm.markAllAsTouched();
      alert('Por favor, complete todos los campos.');
      return;
    }

    const formData = this.contactDataForm.value;
    this.enviarFormularioContacto(formData);
  }

  enviarFormularioContacto(formData: any) {
    this.contactInformationForm = {
      Nombre: formData.Nombre,
      Email: formData.Email,
      Asunto: formData.Asunto,
      Mensaje: formData.Mensaje,
    }

    //console.log("INFO: ", this.contactInformationForm)
    this.emailHelper.sendEmailContact(this.contactInformationForm)
    .subscribe({
      next: data => {
        console.log("RESPONSE: ", data)
        this.contactDataForm.reset()
        this.alertService.showSuccess('Enviado', 'Correo enviado correctamente!')
      },
      error: err => {
        console.error('ERROR AL ENVIAR MAIL: ' + err.error)
        console.log(err.error)
      }
    })
  }
}
