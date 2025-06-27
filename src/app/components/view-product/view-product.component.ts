import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../interfaces/Product.interface';
import { CartService } from '../../services/cart/cart.service';
import { Category } from '../../interfaces/Category.interface';
import { CookieService } from '../../services/cookies/cookie.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../services/alert/alert.service';
import { CartProduct } from '../../interfaces/CartProduct.interface';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.scss'
})
export class ViewProductComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  cookieService = inject(CookieService);
  alertService = inject(AlertService);

  sessionId: number = 0;
  productId: number = 0;
  productDetails: Product = {} as Product;
  categories: Category[] = [];
  categoryName: string = '';
  quantityProductOnCart: number = 0;

  quantityControl = new FormControl(1, [Validators.required, Validators.min(1)]);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.loadSessionId();
    this.productId = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.getProductDetails(this.productId);

    this.quantityControl.valueChanges.subscribe(value => {
      if (this.productDetails?.Stock && value! > this.productDetails.Stock) {
        this.quantityControl.setValue(this.productDetails.Stock, { emitEvent: false });
      }
    });
  }

  loadSessionId() {
    const sessionId = this.cookieService.getCookie('session_ID');
    if (sessionId) {
      this.sessionId = parseInt(sessionId, 10);
    }
  }

  loadCategoryNameById(categoryId: number) {
    this.productService.getCategoryById(categoryId).subscribe({
      next: data => {
        this.categoryName = data.Nombre;
      },
      error: err => {
        console.error('Error obteniendo categoría:', err);
        this.categoryName = 'Categoría no disponible';
      }
    });
  }

  getProductDetails(id: number) {
    this.productService.getProductById(id).subscribe({
      next: data => {
        this.productDetails = data;
        this.loadCategoryNameById(this.productDetails.ID_Categoria);

        this.quantityControl.addValidators(Validators.max(this.productDetails.Stock));
        this.quantityControl.updateValueAndValidity();

        if (this.sessionId) {
          this.getCartProductByClientId(this.sessionId);
        }
      },
      error: err => {
        console.error('Error al obtener detalles del producto:', err);
      }
    });
  }

  getCartProductByClientId(clientId: number) {
    this.cartService.getCartProducts(clientId).subscribe({
      next: (data: CartProduct[]) => {
        const products = data
        const prod = products.find((item: any) => item.ID_Producto === this.productId);
        if (prod) {
          this.quantityProductOnCart = prod.Cantidad;
        }
      },
      error: err => {
        console.error("Error al obtener productos del carrito:", err);
      }
    });
  }

  incrementQuantity() {
    const current = this.quantityControl.value ?? 1;
    if (current < this.productDetails.Stock) {
      this.quantityControl.setValue(current + 1);
    }
  }

  decrementQuantity() {
    const current = this.quantityControl.value ?? 1;
    if (current > 1) {
      this.quantityControl.setValue(current - 1);
    }
  }

  handleCartUpdate(message: string) {
    this.cartService.updateQuantity(this.sessionId);
    this.alertService.AlertProductAddedToCart(
      'Producto agregado al carrito',
      message
    );
  }

  updateQuantityProductCart(quantity: number) {
    const total = this.quantityProductOnCart + quantity;
    if (total <= this.productDetails.Stock) {
      const cartProduct = {
        ID_Cliente: this.sessionId,
        ID_Producto: this.productDetails.ID,
        Cantidad: total
      };

      this.cartService.updateProductQuantity(cartProduct).subscribe({
        next: (data) => {
          this.cartService.setCartData(data)
          this.cartService.updateQuantity(this.sessionId)
          this.getCartProductByClientId(this.sessionId)
          this.handleCartUpdate(`El producto ${this.productDetails.Nombre} ha sido agregado a tu carrito.`)
        },
        error: err => {
          console.error('Error al actualizar cantidad en el carrito:', err);
        }
      });
    }
  }

  addToCart() {
    const cantidad = this.quantityControl.value ?? 1;

    if (this.productDetails.Stock === 0)
      this.alertService.showError('Error', 'Actualmente no tenemos stock de este producto!')

    if (!this.sessionId || !this.productDetails?.ID || !cantidad || this.quantityControl.invalid) {
      console.error("Datos incompletos al agregar al carrito");
      return;
    }

    const cartProduct = {
      ID_Cliente: this.sessionId,
      ID_Producto: this.productDetails.ID,
      Cantidad: cantidad
    };

    if (this.quantityProductOnCart > 0) {
      this.updateQuantityProductCart(cantidad);
    } else {
      this.cartService.addProductToCart(cartProduct).subscribe({
        next: (data) => {
          this.cartService.setCartData(data)
          this.cartService.updateQuantity(this.sessionId);
          this.getCartProductByClientId(this.sessionId);
          this.handleCartUpdate(`El producto ${this.productDetails.Nombre} ha sido agregado a tu carrito.`);
        },
        error: err => {
          console.error("Error al agregar al carrito: ", err);
        }
      });
    }
  }
}
