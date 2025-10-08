import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterLink} from '@angular/router';
import { ProductCardGroupComponent } from '../product-card-group/product-card-group.component';

@Component({
  selector: 'app-carousel-products',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardGroupComponent],
  templateUrl: './carousel-products.component.html',
  styleUrl: './carousel-products.component.scss'
})
export class CarouselProductsComponent implements OnInit, OnChanges {
  @Input() carouselId: string = 'carouselExampleAutoplaying';
  @Input() products: any[] = [];

  groupedProducts: any[][] = [];
  private readonly MOBILE_BREAKPOINT = 768;

  ngOnInit(): void {
    this.setProductGroups();
    window.addEventListener('resize', this.setProductGroupsBound);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.setProductGroups();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.setProductGroupsBound);
  }

  private setProductGroupsBound = this.setProductGroups.bind(this);

  setProductGroups(): void {
    const screenWidth = window.innerWidth;
    let itemsPerGroup = screenWidth < 768 ? 2 : screenWidth < 1200 ? 3 : 4;
    this.groupProducts(itemsPerGroup);
  }

  groupProducts(groupSize: number): void {
    this.groupedProducts = [];
    for (let i = 0; i < this.products.length; i += groupSize) {
      this.groupedProducts.push(this.products.slice(i, i + groupSize));
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
