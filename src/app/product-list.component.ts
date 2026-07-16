import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from './product.service';
import { CartService } from './cart.service';
import { Product } from './models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);

  readonly search = signal('');

  readonly products = this.productService.products;

  readonly filteredProducts = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) {
      return this.products();
    }
    return this.products().filter((p) => {
      return (
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    });
  });

  onSearch(term: string): void {
    this.search.set(term);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1);
  }

  delete(product: Product): void {
    if (confirm(`Delete product "${product.name}"?`)) {
      this.productService.delete(product.id);
    }
  }
}


