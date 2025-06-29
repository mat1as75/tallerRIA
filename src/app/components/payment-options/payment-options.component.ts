import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart/cart.service';
import { CartProduct } from '../../interfaces/CartProduct.interface';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { AlertService } from '../../services/alert/alert.service';
import { Order } from '../../interfaces/Order.interface';
import { OrderService } from '../../services/order/order.service';
import { EmailHelperService } from '../../services/email-helper/email-helper.service';
import { OrderConfirmation } from '../../interfaces/OrderConfirmation.interface';
import { UserServiceService } from '../../services/user/user-service.service';
import { PriceFormatPipe } from '../../shared/price-format.pipe';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PriceFormatPipe],
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.scss'
})
export class PaymentOptionsComponent implements OnInit {
  private cartService = inject(CartService)
  private orderService = inject(OrderService)
  private alertService = inject(AlertService)
  private userService = inject(UserServiceService)
  private emailHelperService = inject(EmailHelperService)
  private localStorageService = inject(LocalStorageService)

  cartProductList: CartProduct[] = []
  sessionClientId: number = 0
  email: string = ''
  clientName: string = ''

  paymentDataForm: FormGroup
  shippingInfo: any
  shippingCost: number = 5.00
  newOrderId: number = 0

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
      card_verification_code: this.formBuilder.control('', [Validators.required, this.cvvValidator]),
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

    this.getClientEmail()

    const shippingData = this.cartService.getShippingInfo()

    if (shippingData) {
      this.shippingInfo = shippingData
    } else {
      const localShippingInfo = this.localStorageService.getItem('shippingInfo')
      if (localShippingInfo) {
        this.shippingInfo = typeof localShippingInfo === 'string' ? JSON.parse(localShippingInfo) : localShippingInfo
        this.cartService.setShippingInfo(this.shippingInfo)
      }
    }

    // Validar que shippingInfo este completo
    if (
      !this.shippingInfo || 
      !this.shippingInfo.DireccionCliente || 
      !this.shippingInfo.TelefonoCliente || 
      !this.shippingInfo.DepartamentoCliente || 
      !this.shippingInfo.CiudadCliente
    ) {
      this.alertService.showError('Datos de envío incompletos', 'Por favor, completá tus datos de envío antes de continuar con el pago.')
      this.router.navigate(['/detallesEnvio'])
      return
    } else {
      console.log("NO ENTRO ")
    }

    this.paymentDataForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      const isCreditCard = value === 'creditCard'

      this.toggleCardFieldsValidation(isCreditCard)
    });

    const initialValue = this.paymentDataForm.get('paymentMethod')?.value
    this.toggleCardFieldsValidation(initialValue === 'creditCard')
  }

  trackByProducts(index: number, product: CartProduct): number { return product.ID_Producto } 

  calculateTotalCartPrice(): number {
    return this.cartProductList.reduce((total, product) => {
      const precio = parseFloat(product.Precio)
      return total + (precio * product.Cantidad)
    }, this.shippingCost)
  }

  onCardNumberInput() {
    const control = this.paymentDataForm.get('card_number')
    let value = control?.value?.replace(/\D/g, '') || ''
    value = value.match(/.{1,4}/g)?.join(' ') || ''
    control?.setValue(value, { emitEvent: false })
  }

  onCardMaturityImput() {
    const control = this.paymentDataForm.get('card_maturity')
    let value = control?.value || '';

    value = value.replace(/\D/g, '');

    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }

    control?.setValue(value, { emitEvent: false })
  }

  cvvValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValid = /^[0-9]{3,4}$/.test(value);
    return isValid ? null : { invalidCvv: true };
  }

  onCvvInput(event: Event) {
    const input = event.target as HTMLInputElement;
  input.value = input.value.replace(/\D/g, '')

  this.paymentDataForm.get('card_verification_code')?.setValue(input.value, { emitEvent: false })
  }

  onPaymentChange(method: string) {
    this.paymentDataForm.get('paymentMethod')?.setValue(method)
  }

  getCartProductByClientId(client_id: number) {
    this.cartService.getCartProducts(client_id)
    .subscribe({
      next: (data: CartProduct[]) => {
        this.cartProductList = data
        console.log("OPCIONES PAGO: Productos carrito cargados!")

        if (this.cartProductList.length === 0) {
          this.alertService.showError('Error', 'No hay productos en el carrito. Agregá al menos un producto antes de continuar con la compra.')
          this.router.navigate(['/catalogo'])
        }
      },
      error: err => {
        console.error(err)
        console.log("OPCIONES PAGO: Productos carrito no cargados!")
      }
    })
  }

  getClientEmail() {
    this.userService.ObtenerUsuario(String(this.sessionClientId))
    .subscribe({
      next: data => {
        this.email = data.Email
        this.clientName = data.Nombre
      },
      error: err => {
        console.error('Error al obtener datos de Cliente: ' + err)
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

  createDataOrder(): Order {                                                                                              
    return {
      ID: Number(''),
      ID_Cliente: this.sessionClientId,
      Nombre_Cliente: '',
      Total: this.cartProductList.reduce((total, product) => {
        return total + parseFloat(product.Precio) * product.Cantidad
      }, this.shippingCost),
      Estado: 'pendiente',
      datosEnvio: {
        telefonoCliente: this.shippingInfo.TelefonoCliente,
        direccionCliente: this.shippingInfo.DireccionCliente,
        departamentoCliente: this.shippingInfo.DepartamentoCliente,
        ciudadCliente: this.shippingInfo.CiudadCliente
      },
      productos: this.cartProductList.map(product => ({
        id_producto: product.ID_Producto,
        cantidad: product.Cantidad,
        precio: parseFloat(product.Precio)
      }))
    };
  }

  postCreateOrderDB() {
    const orderData = this.createDataOrder()

    this.orderService.createOrder(orderData)
    .subscribe({
      next: data => {
        const res = JSON.parse(String(data))
        this.newOrderId = res.ID_Pedido

        console.log('Pedido creado ID: ' + res.ID_Pedido)

        // Add ID_Pedido
        const confirmationData = this.createDataConfirmation()
        confirmationData.ID_Pedido = res.ID_Pedido

        // Save on localStorage
        this.localStorageService.setItem('lastConfirmation', confirmationData)

        // Send Email Confirmed
        this.sendEmailConfirmation()

        this.localStorageService.removeItem('shippingInfo')
        this.clearCart(this.sessionClientId)
        this.cartService.resetQuantity()
    
        this.router.navigate(['/confirmacionPago'])
      },
      error: err => {
        console.error('Error al crear pedido: ' + err.error)
      }
    })
  }

  createDataConfirmation(): OrderConfirmation {
    return {
      Email: this.email,
      Nombre: this.clientName,
      ID_Pedido: this.newOrderId,
      Total: this.calculateTotalCartPrice(),
      MetodoPago: this.paymentDataForm.get('paymentMethod')?.value,
      FechaPedido: new Date().toISOString().split('T')[0],
      productos: this.cartProductList.map(product => ({
        Nombre: product.Nombre,
        Cantidad: product.Cantidad,
        Precio: Number(product.Precio)
      }))
    };
  }

  sendEmailConfirmation() {
    this.emailHelperService.sendEmail(this.createDataConfirmation())
    .subscribe({
      next: data => {
        //const resJSON = JSON.parse(data)
        console.log(data)
      },
      error: err => {
        console.error('ERROR AL ENVIAR MAIL: ' + err.error)
        console.log(err.error)
      }
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

    // Crear pedido en DB
    this.postCreateOrderDB()
  }

  waitForProcessingTime(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
