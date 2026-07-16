import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent {
  private readonly cartService = inject(CartService);

  readonly items = this.cartService.items;
  readonly totalQuantity = this.cartService.totalQuantity;
  readonly totalPrice = this.cartService.totalPrice;

  increase(id: number): void {
    const current = this.items().find((i) => i.product.id === id);
    if (current) {
      this.cartService.updateQuantity(id, current.quantity + 1);
    }
  }

  decrease(id: number): void {
    const current = this.items().find((i) => i.product.id === id);
    if (current) {
      this.cartService.updateQuantity(id, current.quantity - 1);
    }
  }

  remove(id: number): void {
    this.cartService.removeItem(id);
  }

  clear(): void {
    this.cartService.clear();
  }
}


