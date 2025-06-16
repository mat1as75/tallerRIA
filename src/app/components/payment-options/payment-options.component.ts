import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { ProductCart } from '../../interfaces/ProductCart.interface';
import { ShippingInfo } from '../../interfaces/ShippingInfo.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.scss'
})
export class PaymentOptionsComponent implements OnInit {
  private cartService = inject(CartService)
  private alertService = inject(AlertService)
  private localStorageService = inject(LocalStorageService)

  cartProductList: ProductCart[] = []
  sessionClientId: number = 0

  paymentDataForm: FormGroup
  shippingInfo: ShippingInfo
  shippingCost: number = 5.00

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    const session_ID = this.localStorageService.getItem('session_ID')
    if (session_ID !== null)
      this.sessionClientId = Number(session_ID)

    this.paymentDataForm = this.formBuilder.group({
      paymentMethod: this.formBuilder.control('creditCard', Validators.required),
      card_number: this.formBuilder.control('', Validators.required),
      card_maturity: this.formBuilder.control('', Validators.required),
      card_verification_code: this.formBuilder.control('', Validators.required),
      card_holder: this.formBuilder.control('', Validators.required)
    })

    this.paymentDataForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      if (value === 'creditCard') {
        this.paymentDataForm.get('card_number')?.enable();
        this.paymentDataForm.get('card_maturity')?.enable();
        this.paymentDataForm.get('card_verification_code')?.enable();
        this.paymentDataForm.get('card_holder')?.enable();
      } else {
        this.paymentDataForm.get('card_number')?.disable();
        this.paymentDataForm.get('card_maturity')?.disable();
        this.paymentDataForm.get('card_verification_code')?.disable();
        this.paymentDataForm.get('card_holder')?.disable();
      }
    });

    this.shippingInfo = {
      Nombre: '',
      Apellido: '',
      TelefonoCliente: '',
      DireccionCliente: '',
      DepartamentoCliente: '',
      CiudadCliente: '',
    }
  }

  ngOnInit(): void {
    // Cart Data Products
    if (this.sessionClientId)
      this.getCartProductByClientId(this.sessionClientId)

    // Shipping Data Info
    const shippingData = this.cartService.getShippingInfo()

    if (!shippingData) {
      const localShippingInfo = this.localStorageService.getItem('shippingInfo')
      if (localShippingInfo) {
        this.shippingInfo = typeof localShippingInfo === 'string' ? JSON.parse(localShippingInfo) : localShippingInfo
        this.cartService.setShippingInfo(this.shippingInfo)
      }
    }

    this.paymentDataForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      const isCreditCard = value === 'creditCard'

      this.toggleCardFieldsValidation(isCreditCard)
    });

    const initialValue = this.paymentDataForm.get('paymentMethod')?.value
    this.toggleCardFieldsValidation(initialValue === 'creditCard')
  }

  trackByProducts(index: number, product: ProductCart): number { return product.ID_Producto } 

  calculateTotalCartPrice(): number {
    return this.cartProductList.reduce((total, product) => {
      const precio = parseFloat(product.Precio)
      return total + (precio * product.Cantidad)
    }, 0)
  }

  onPaymentChange(method: string) {
    this.paymentDataForm.get('paymentMethod')?.setValue(method)
  }

  getCartProductByClientId(client_id: number) {
    this.cartService.getCartProducts(client_id)
    .subscribe({
      next: data => {
        this.cartProductList = data
        console.log("OPCIONES PAGO: Productos carrito cargados!")
      },
      error: err => {
        console.error(err)
        console.log("OPCIONES PAGO: Productos carrito no cargados!")
      }
    })
  }

  private toggleCardFieldsValidation(enable: boolean) {
    const controls = ['card_number', 'card_maturity', 'card-verification_code', 'card_holder']
    
    controls.forEach(field => {
      const control = this.paymentDataForm.get(field)

      if (enable) {
        control?.setValidators([Validators.required])
        control?.enable()
      } else {
        control?.clearValidators()
        control?.disable()
      }

      control?.updateValueAndValidity()
    })
  }

  returnToShippingInfo() {
    this.router.navigate(['/detallesEnvio'])
  }

  clearCart(session_ID: number) {
    this.cartService.clearCart(session_ID)
    .subscribe({
      next: data => {
        this.cartService.clearCartData()
      },
      error: err => {
        console.error(err)
        console.log('CLEAR CART DATA: ' + err)
      }
    })
  }

  async confirmPurchase() {
    if (this.paymentDataForm.invalid) {
      this.paymentDataForm.markAllAsTouched()
      this.alertService.showError('Error', 'Complete todos los campos requeridos.')
      return
    }

    // Simular el procesamiento de una compra
    this.alertService.showProcessing('¡Casi listo!', 'Estamos procesando tu pago. Un momento, por favor...')
    await this.waitForProcessingTime(5000)
    this.alertService.closeAlert()

    // [ ] Crear pedido en DB
    // [ ] Enviar mail confirmando pedido

    this.localStorageService.removeItem('shippingInfo')
    this.clearCart(this.sessionClientId)
    
    this.router.navigate(['/confirmacionPago'])
  }

  waitForProcessingTime(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
