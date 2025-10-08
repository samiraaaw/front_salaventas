import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-products-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products-home.component.html',
  styleUrl: './products-home.component.scss'
})
export class ProductsHomeComponent {
  @Input() products: any[] = []; // Lista de productos a mostrar
    constructor(private router: Router) {}

    goToProduct(productId: string) {
      this.router.navigate(['/productdetail', productId]);
    }
}
