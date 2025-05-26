import { Routes } from '@angular/router';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductOrdersComponent } from './components/product-orders/product-orders.component';
//import { ViewProductComponent } from './components/view-product/view-product.component';

export const routes: Routes = [
    {path: 'catalogo', component: ProductCatalogComponent},
    //{path: 'producto/:id', component: ViewProductComponent}  esta comentado porque al no estar implementado me daba error en esta branch
    {path: 'altaProducto', component: ProductCreateComponent},
    {path: 'listaProducto', component: ProductListComponent},
    {path: 'ordenesProducto', component: ProductOrdersComponent}
];
