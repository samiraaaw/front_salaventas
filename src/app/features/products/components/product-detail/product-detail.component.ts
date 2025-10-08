import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { switchMap, tap } from 'rxjs/operators';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../cart/services/cart.service';
import { CarouselComponent } from '../../../../shared/components/carousel/carousel.component';
import { BannerComponent } from '../../../../shared/components/banner/banner.component';
import { CarouselProductsComponent } from '../../../../shared/components/carousel-products/carousel-products.component';
import { ProductCardGroupComponent } from '../../../../shared/components/product-card-group/product-card-group.component';
import Swal from 'sweetalert2';
import { ProductApiService } from '../../../general/services/product-api.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CarouselComponent,
    BannerComponent,
    CarouselProductsComponent,
    ProductCardGroupComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: Product | null = null;
  loading: boolean = true;
  error: string | null = null;
  selectedImage: string = '';
  isInCart: boolean = false;

  recentproducts: any[] = [];
  recommendedProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private productApiService: ProductApiService

  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    this.productApiService.getProducts().subscribe({
      next: products => {
        console.log('📦 Productos cargados:', products);
        // ✅ reasignas a un nuevo array
        this.recommendedProducts = [...products];
      },
      error: err => console.error('❌ Error al cargar productos:', err)
    });


    // Escuchar cambios en los parámetros de la ruta (especialmente el ID)
      this.route.paramMap.pipe(
        switchMap(params => {
          this.loading = true;
          this.error = null;
          this.productId = params.get('id');
          console.log('[DEBUG] New route param ID:', this.productId);

          if (this.productId) {
            return this.productApiService.getProductById(this.productId);
          } else {
            return Promise.resolve(null);
          }
        })
      ).subscribe({
        next: (product: Product | null) => {
          this.product = product;
          if (product) {
            this.selectedImage = product.image;
            this.isInCart = this.cartService.getCartItems().some(item => item.id === product.id);
          } else {
            this.error = 'Producto no encontrado';
          }
          this.loading = false;
          this.viewportScroller.scrollToPosition([0, 0]);
        },
        error: () => {
          this.error = 'Error al cargar el producto';
          this.loading = false;
          this.viewportScroller.scrollToPosition([0, 0]);
        }
      });
    }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.isInCart = true;
    }
  }

    goBackToHome(): void {
      this.router.navigate(['/'], {
        queryParams: { scrollToFilters: 'true' }
      });
    }
      
  reservar(): void {
    Swal.fire({
      title: '¿Reservar este producto?',
      text: 'La reserva tiene una duración de 2 días hábiles. Deberás acudir a la sucursal correspondiente para verlo o adquirirlo. Si no lo haces, el producto volverá a estar disponible para otros usuarios.',
      icon: 'warning',
      iconColor: '#ffc107',
      showCancelButton: true,
      confirmButtonText: 'Sí, reservar por 2 días',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-4 p-4',
        confirmButton: 'btn btn-primary me-2',
        cancelButton: 'btn btn-outline-secondary'
      },
      buttonsStyling: false
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¡Reservado!',
          text: 'El producto ha sido reservado correctamente. Recuerda que tienes 2 días hábiles para asistir a la sucursal.',
          icon: 'success',
          iconColor: '#198754',
          confirmButtonText: 'Entendido',
          customClass: {
            popup: 'rounded-4 p-4',
            confirmButton: 'btn btn-success'
          },
          buttonsStyling: false
        });
      }
    }).catch(() => {
      console.log('Reserva cancelada.');
    });
  }
}
