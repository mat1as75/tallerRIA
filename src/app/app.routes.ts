import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductOrdersComponent } from './components/product-orders/product-orders.component';

export const routes: Routes = [
    {path: 'catalogo', component: ProductCatalogComponent},
    {path: 'producto/:id', component: ViewProductComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'altaProducto', component: ProductCreateComponent},
    {path: 'listaProducto', component: ProductListComponent},
    {path: 'ordenesProducto', component: ProductOrdersComponent}
];
