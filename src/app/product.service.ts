import { Injectable, effect, signal } from '@angular/core';
import { Product } from './models';

const STORAGE_KEY = 'productApp_products';

// Simple in-memory mock data; in real app this could come from HTTP.
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Wireless Mouse',
    price: 1499,
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with 2.4GHz receiver.',
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    price: 3999,
    category: 'Electronics',
    description: 'RGB backlit mechanical keyboard with blue switches.',
  },
  {
    id: 3,
    name: 'Office Chair',
    price: 8999,
    category: 'Furniture',
    description: 'Comfortable office chair with lumbar support.',
  },
];

function loadInitialProducts(): Product[] {
  if (typeof localStorage === 'undefined') {
    return [...INITIAL_PRODUCTS];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Product[];//string to array convert
      // Ensure we have at least the initial products if localStorage is empty or corrupted
      return saved.length > 0 ? saved : [...INITIAL_PRODUCTS];
    }
    return [...INITIAL_PRODUCTS];
  } catch {
    return [...INITIAL_PRODUCTS];
  }
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly productsSignal = signal<Product[]>(loadInitialProducts());

  readonly products = this.productsSignal.asReadonly();

  constructor() {
    // Persist products to localStorage whenever they change (browser only)
    effect(() => {
      if (typeof localStorage === 'undefined') {
        return;
      }
      const data = JSON.stringify(this.productsSignal());//array to json string convert
      localStorage.setItem(STORAGE_KEY, data);//save data on localstaorage
    });
  }

  getById(id: number): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }

  upsert(product: Omit<Product, 'id'> & { id?: number }): void {
    const current = this.productsSignal();
    if (product.id != null) {//edit
      this.productsSignal.set(
        current.map((p) => (p.id === product.id ? { ...p, ...product } : p)),
      );
      return;
    }

    const nextId = current.length ? Math.max(...current.map((p) => p.id)) + 1 : 1;//generate id
    this.productsSignal.set([...current, { ...product, id: nextId } as Product]);
  }

  delete(id: number): void {
    this.productsSignal.set(this.productsSignal().filter((p) => p.id !== id));
  }
}


