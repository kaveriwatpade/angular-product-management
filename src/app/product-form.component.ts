import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from './product.service';
import { Product } from './models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  private readonly productIdSignal = signal<number | null>(null);

  readonly isEditMode = computed(() => this.productIdSignal() != null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);//convert string to number
      const existing = this.productService.getById(id);
      if (existing) {
        this.productIdSignal.set(id);//iseditMode becomes true
        this.form.patchValue({
          name: existing.name,
          price: existing.price,
          category: existing.category,
          description: existing.description,
        });
      }
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();//get all form values as objecr
    const id = this.productIdSignal();
    const payload: Omit<Product, 'id'> & { id?: number } = {
      ...value,
      id: id ?? undefined,
    };

    this.productService.upsert(payload);
    this.router.navigate(['/products']);
  }
}


