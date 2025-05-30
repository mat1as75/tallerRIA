import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about-us/about-us.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductOrdersComponent } from './components/product-orders/product-orders.component';

export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'sobre-nosotros', component: AboutComponent },
    {path: 'catalogo', component: ProductCatalogComponent},
    {path: 'producto/:id', component: ViewProductComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'altaProducto', component: ProductCreateComponent},
    {path: 'listaProducto', component: ProductListComponent},
    {path: 'ordenesProducto', component: ProductOrdersComponent}
];
