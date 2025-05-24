import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ViewProductComponent } from './components/view-product/view-product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    {path: 'catalogo', component: ProductCatalogComponent},
    {path: 'producto/:id', component: ViewProductComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent}
];
