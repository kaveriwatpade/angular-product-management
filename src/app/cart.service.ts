import { Injectable, computed, effect, signal } from '@angular/core';
import { CartItem, Product } from './models';

const STORAGE_KEY = 'productApp_cart';

function loadInitialCart(): CartItem[] {
  if (typeof localStorage === 'undefined') {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>(loadInitialCart());

  readonly items = this.itemsSignal.asReadonly();

  readonly totalQuantity = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity * item.product.price, 0),
  );

  constructor() {
    // Persist cart to localStorage whenever it changes (browser only)
    effect(() => {
      if (typeof localStorage === 'undefined') {
        return;
      }
      const data = JSON.stringify(this.itemsSignal());
      localStorage.setItem(STORAGE_KEY, data);
    });
  }

  addToCart(product: Product, quantity = 1): void {
    const current = this.itemsSignal();
    const existing = current.find((i) => i.product.id === product.id);
    if (existing) {
      this.itemsSignal.set(
        current.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        ),
      );
    } else {
      this.itemsSignal.set([...current, { product, quantity }]);
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.itemsSignal.set(
      this.itemsSignal().map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    );
  }

  removeItem(productId: number): void {
    this.itemsSignal.set(this.itemsSignal().filter((i) => i.product.id !== productId));
  }

  clear(): void {
    this.itemsSignal.set([]);
  }
}


