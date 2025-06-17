import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CartProduct } from '../../interfaces/CartProduct.interface';
import { CartService } from '../../services/cart/cart.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShippingInfo } from '../../interfaces/ShippingInfo.interface';
import { AlertService } from '../../services/alert/alert.service';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-send-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './send-details.component.html',
  styleUrl: './send-details.component.scss'
})
export class SendDetailsComponent implements OnInit {
  private cartService = inject(CartService)
  private alertService = inject(AlertService)
  private localStorageService = inject(LocalStorageService)

  cartProductList: CartProduct[] = []
  sessionClientId?: number | null

  shippingDataForm: FormGroup
  shippingInfo?: ShippingInfo

  departaments: string[] = [
    'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno',
    'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo',
    'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto',
    'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.shippingDataForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      room: [''],
      departament: ['', [Validators.required]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required]]
    })
  }
  
  ngOnInit(): void {
    // Cart Data Products
    this.sessionClientId = this.localStorageService.getItem('session_ID')
    if (this.sessionClientId)
      this.getCartProductByClientId(this.sessionClientId)

    const shippingInfo = this.cartService.getShippingInfo()
    if (shippingInfo) {
      const completeAddress = shippingInfo.DireccionCliente
      const [address, room] = completeAddress.split(' - ')

      this.shippingDataForm.get('name')?.setValue(shippingInfo.Nombre)
      this.shippingDataForm.get('last_name')?.setValue(shippingInfo.Apellido)
      this.shippingDataForm.get('address')?.setValue(address)
      this.shippingDataForm.get('room')?.setValue(room)
      this.shippingDataForm.get('departament')?.setValue(shippingInfo.DepartamentoCliente)
      this.shippingDataForm.get('city')?.setValue(shippingInfo.CiudadCliente)
      this.shippingDataForm.get('phone')?.setValue(shippingInfo.TelefonoCliente)
      console.log('Auto-completando inputs')
    }
  }

  trackByProducts(index: number, product: CartProduct): number { return product.ID_Producto } 

  calculateTotalCartPrice(): number {
    return this.cartProductList.reduce((total, product) => {
      const precio = parseFloat(product.Precio)
      return total + (precio * product.Cantidad)
    }, 0)
  }

  getCartProductByClientId(client_id: number) {
    this.cartService.getCartProducts(client_id)
    .subscribe({
      next: data => {
        this.cartProductList = data
        console.log("DETALLES DE ENVIO: Productos carrito cargados!")
      },
      error: err => {
        console.error(err)
        console.log("DETALLES DE ENVIO: Productos carrito no cargados!")
      }
    })
  }

  parseFormToShippingInfo(): ShippingInfo {
    const form = this.shippingDataForm

    const room = form.get('room')?.value || ''
    const address = form.get('address')?.value || ''
    const completeAddress = `${address} - ${room}`.trim()

    const shippingInfo: any = {
      Nombre: form.get('name')?.value || '',
      Apellido: form.get('last_name')?.value || '',
      TelefonoCliente: form.get('phone')?.value || '',
      DireccionCliente: completeAddress,
      DepartamentoCliente: form.get('departament')?.value || '',
      CiudadCliente: form.get('city')?.value || '',
    };

    return shippingInfo;
  }

  verifyDataForm() {
    this.shippingDataForm.markAllAsTouched()

    if (this.shippingDataForm.invalid) {
      this.alertService.showError('Error','Complete todos los campos requeridos.')
      return false
    }

    return true
  }

  returnToCart() {
    this.router.navigate(['/carrito'])
  }

  advanceToPayment() {
    if (!this.verifyDataForm())
      return

    const shippingInfo = this.parseFormToShippingInfo()
    this.localStorageService.setItem('shippingInfo', shippingInfo)
    this.router.navigate(['/opcionesPago'])
  }
}
