import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-product-card-group',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card-group.component.html',
  styleUrl: './product-card-group.component.scss'
})
export class ProductCardGroupComponent {
  @Input() products: any[] = []; // Lista de productos a mostrar
    constructor(private router: Router) {}

    goToProduct(productId: string) {
      this.router.navigate(['/productdetail', productId]);
    }
}


