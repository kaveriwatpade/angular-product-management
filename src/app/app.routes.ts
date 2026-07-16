import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list.component';
import { ProductFormComponent } from './product-form.component';
import { CartPageComponent } from './cart-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id/edit', component: ProductFormComponent },
  { path: 'cart', component: CartPageComponent },
  { path: '**', redirectTo: 'products' },
];
