import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about-us/about-us.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductOrdersComponent } from './components/product-orders/product-orders.component';
import { AltaGestorComponent } from './components/alta-gestor/alta-gestor.component';
import { ModificarPedidoComponent } from './components/modificar-pedido/modificar-pedido.component';
import { ReuperarpasswordComponent } from './components/reuperarpassword/reuperarpassword.component';
import { CambiarpasswordComponent } from './components/cambiarpassword/cambiarpassword.component';
import { DetallesdecuentaComponent } from './components/detallesdecuenta/detallesdecuenta.component';
import { ShopCartComponent } from './components/shop-cart/shop-cart.component';
import { SendDetailsComponent } from './components/send-details/send-details.component';
import { PaymentOptionsComponent } from './components/payment-options/payment-options.component';
import { PaymentConfirmationComponent } from './components/payment-confirmation/payment-confirmation.component';
import { HistoriaComprasComponent } from './components/historia-compras/historia-compras.component';
import { GestorUpdateComponent } from './components/gestor-update/gestor-update.component';
import { DetallesdepedidoComponent } from './components/detallesdepedido/detallesdepedido.component';
import { OrderListComponent } from './components/order-list/order-list.component';



export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'sobre-nosotros', component: AboutComponent },
    { path: 'catalogo', component: ProductCatalogComponent },
    { path: 'producto/:id', component: ViewProductComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'altaProducto', component: ProductCreateComponent },
    { path: 'editarProducto/:id', component: ProductEditComponent },
    { path: 'listaProducto', component: ProductListComponent },
    { path: 'ordenesProducto', component: ProductOrdersComponent },
    { path: 'altaGestor', component: AltaGestorComponent },
    { path: 'modificarPedido/:id', component: ModificarPedidoComponent },
    { path: 'listaPedido', component: OrderListComponent },
    { path: 'recuprarpassword', component: ReuperarpasswordComponent },
    { path: 'cambiopassword', component: CambiarpasswordComponent },
    { path: 'detallesdecuenta', component: DetallesdecuentaComponent },
    { path: 'carrito', component: ShopCartComponent },
    { path: 'detallesEnvio', component: SendDetailsComponent },
    { path: 'opcionesPago', component: PaymentOptionsComponent },
    { path: 'confirmacionPago', component: PaymentConfirmationComponent },
    { path: 'MisCompras', component: HistoriaComprasComponent },
    { path: 'modificarGestor', component: GestorUpdateComponent },
    { path: 'detallesPedido/:id', component: DetallesdepedidoComponent },

];
