import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ViewProductComponent } from './components/view-product/view-product.component';

export const routes: Routes = [
    {path: 'catalogo', component: ProductCatalogComponent},
    {path: 'producto/:id', component: ViewProductComponent}    
];
