import { Component, inject, OnInit } from '@angular/core';
import { CartProduct } from '../../interfaces/CartProduct.interface';
import { CartService } from '../../services/cart/cart.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.scss'
})
export class ShopCartComponent implements OnInit{
  cartService = inject(CartService)
  localStorageService = inject(LocalStorageService)

  email = 'soporte@tecnostore.com'
  cartProductList: CartProduct[] = []

  sessionClientId?: number | null
  quantityProductsCart: number = 0

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Cart Data Products
    this.sessionClientId = this.localStorageService.getItem('session_ID')
    if (this.sessionClientId) {
      this.getCartProductByClientId(this.sessionClientId)
      this.cartService.updateQuantity(this.sessionClientId)
    }
      
    this.cartService.quantity$.subscribe(count => {
      this.quantityProductsCart = count;
    });
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
        console.log("CARRITO: Productos carrito cargados!")
      },
      error: err => {
        console.error(err)
        console.log("CARRITO: Productos carrito no cargados!")
      }
    })
  }

  updateQuantity(product_id: number, quantity: number) {
    // Quantity = 0
    if (quantity === 0) {
      this.cartService.removeCartProduct({
        ID_Cliente: this.sessionClientId,
        ID_Producto: product_id,
        Cantidad: 0
      }).subscribe({
        next: data => {
          if (this.sessionClientId) {
            this.getCartProductByClientId(this.sessionClientId)
            this.cartService.updateQuantity(this.sessionClientId)
          }
          console.log('Cantidad de producto ' + product_id + 'actualizada!')
        },
        error: err => {
          console.error(err)
          console.log("Cantidad de producto no actualizada!")
        }
      })
      return
    }

    // Quantity > 0
    this.cartService.updateProductQuantity({
      ID_Cliente: this.sessionClientId,
      ID_Producto: product_id,
      Cantidad: quantity
    }).subscribe({
      next: data => {
        if (this.sessionClientId) {
          this.getCartProductByClientId(this.sessionClientId)
          this.cartService.updateQuantity(this.sessionClientId)
        }
        console.log('Cantidad de producto ' + product_id + 'actualizada!')
      },
      error: err => {
        console.error(err)
        console.log("Cantidad de producto no actualizada!")
      }
    })
  }

  removeCartProduct(product_id: number) {
    this.cartService.removeCartProduct({
      ID_Cliente: this.sessionClientId,
      ID_Producto: product_id
    }).subscribe({
      next: data => {
        if (this.sessionClientId) {
          this.getCartProductByClientId(this.sessionClientId)
          this.cartService.updateQuantity(this.sessionClientId)
        }
        console.log('Producto ' + product_id + ' eliminado del carrito!')
      },
      error: err => {
        console.error(err)
        console.log("Producto no eliminado del carrito!")
      }
    })
  }

  returnToShop() {
    this.router.navigate(['/catalogo'])
  }

  advanceShippingDetails(cartProductList: CartProduct[]) {
    this.router.navigate(['/detallesEnvio'])
  }
}
