import { Component, inject, OnInit } from '@angular/core';
import { CartProduct } from '../../interfaces/CartProduct.interface';
import { CartService } from '../../services/cart/cart.service';
import { Router, RouterLink } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PriceFormatPipe } from '../../shared/price-format.pipe';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-shop-cart',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, PriceFormatPipe],
  templateUrl: './shop-cart.component.html',
  styleUrl: './shop-cart.component.scss'
})
export class ShopCartComponent implements OnInit {
  private cartService = inject(CartService);
  private localStorageService = inject(LocalStorageService);
  private alertService = inject(AlertService)
  private router = inject(Router);

  email = 'soporte@tecnostore.com'
  cartProductList: CartProduct[] = [];
  quantityProductsCart = 0;
  sessionClientId?: number;

  ngOnInit(): void {
    const session = this.localStorageService.getItem('session_ID');

    if (session) {
      this.sessionClientId = Number(session);

      // Cargar carrito
      this.loadCartData(this.sessionClientId);
      this.cartService.updateQuantity(this.sessionClientId);
    }

    this.cartService.cartData$.subscribe(data => {
      this.cartProductList = data;
    });

    this.cartService.quantity$.subscribe(count => {
      this.quantityProductsCart = count;
    });
  }

  loadCartData(clientId: number) {
    this.cartService.getCartProducts(clientId).subscribe({
      next: (data: CartProduct[]) => {
        console.log("PRODUCTOS DEL CARRITO:", data);
        this.cartService.setCartData(data);
      },
      error: err => {
        console.error("Error al obtener productos del carrito:", err);
        this.cartService.setCartData([]);
      }
    });
  }

  calculateTotalCartPrice(): number {
    return Array.isArray(this.cartProductList)
      ? this.cartProductList.reduce((total, product) => {
          const precio = parseFloat(product.Precio);
          return total + (precio * product.Cantidad);
        }, 0)
      : 0;
  }

  updateQuantity(productId: number, quantity: number) {
    if (!this.sessionClientId) return;

    const action = quantity === 0
      ? this.cartService.removeCartProduct({ ID_Cliente: this.sessionClientId, ID_Producto: productId, Cantidad: 0 })
      : this.cartService.updateProductQuantity({ ID_Cliente: this.sessionClientId, ID_Producto: productId, Cantidad: quantity });

    action.subscribe({
      next: () => {
        this.loadCartData(this.sessionClientId!);
        this.cartService.updateQuantity(this.sessionClientId!);
        console.log(`Cantidad actualizada para producto ${productId}`);
      },
      error: err => {
        console.error(`Error al actualizar producto ${productId}:`, err);
      }
    });
  }

  removeCartProduct(productId: number) {
    if (!this.sessionClientId) return;

    this.cartService.removeCartProduct({
      ID_Cliente: this.sessionClientId,
      ID_Producto: productId
    }).subscribe({
      next: () => {
        this.loadCartData(this.sessionClientId!);
        this.cartService.updateQuantity(this.sessionClientId!);
        console.log(`Producto ${productId} eliminado del carrito`);
      },
      error: err => {
        console.error("Error al eliminar producto del carrito:", err);
      }
    });
  }

  returnToShop() {
    this.router.navigate(['/catalogo']);
  }

  advanceShippingDetails(cartProductList: CartProduct[]) {
    if (cartProductList.length === 0) {
      this.alertService.showError('Error', 'No hay productos en el carrito. Agregá al menos un producto antes de continuar con la compra.')
      return
    }
      
    this.router.navigate(['/detallesEnvio']);
  }

  trackByProducts(index: number, product: CartProduct): number {
    return product.ID_Producto;
  }
}
