import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../cart/services/cart.service';
import { CarouselComponent } from '../../../../shared/components/carousel/carousel.component';
import { BannerComponent } from '../../../../shared/components/banner/banner.component';
import { CarouselProductsComponent } from '../../../../shared/components/carousel-products/carousel-products.component';
import { ProductCardGroupComponent } from '../../../../shared/components/product-card-group/product-card-group.component';
import Swal from 'sweetalert2';
import { ProductApiService } from '../../../general/services/product-api.service';
import { MockProductsService } from '../../../../shared/services/mock-products.services.service';

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
  activeTab: string = 'details';

  recentproducts: any[] = [];
  recommendedProducts: any[] = [];

  // 🔧 Cambia a true para usar API real, false para mock
  private USE_REAL_API = false;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private productApiService: ProductApiService,
    private mockProductsService: MockProductsService
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    // Elegir servicio según configuración
    const productService = this.USE_REAL_API ? this.productApiService : this.mockProductsService;

    // Cargar todos los productos para recomendaciones
    productService.getProducts().subscribe({
      next: products => {
        console.log('📦 Productos cargados:', products);
        this.recommendedProducts = [...products];
      },
      error: err => console.error('❌ Error al cargar productos:', err)
    });

    // Escuchar cambios en los parámetros de la ruta
    this.route.paramMap.pipe(
      switchMap(params => {
        this.loading = true;
        this.error = null;
        this.productId = params.get('id');
        console.log('[DEBUG] Cargando producto ID:', this.productId);
        console.log('[DEBUG] Usando servicio:', this.USE_REAL_API ? 'API Real' : 'Mock');

        if (this.productId) {
          return productService.getProductById(this.productId);
        } else {
          return of(null);
        }
      })
    ).subscribe({
      next: (product: any) => {
        console.log('[DEBUG] Producto recibido:', product);
        this.product = product;
        if (product) {
          this.selectedImage = product.image;
          this.isInCart = this.cartService.getCartItems().some(item => item.id === product.id);
          
          // Filtrar productos relacionados (misma categoría, excluyendo el actual)
          this.filterRecommendedProducts();
        } else {
          this.error = 'Producto no encontrado';
        }
        this.loading = false;
        this.viewportScroller.scrollToPosition([0, 0]);
      },
      error: (err) => {
        console.error('[DEBUG] Error al cargar producto:', err);
        this.error = 'Error al cargar el producto';
        this.loading = false;
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }

  // Filtrar productos relacionados
  private filterRecommendedProducts(): void {
    if (this.product && this.recommendedProducts.length > 0) {
      this.recommendedProducts = this.recommendedProducts
        .filter(p => 
          p.id !== this.product!.id && // Excluir el producto actual
          (p.categoria === this.product!.categoria || p.productoNombre === this.product!.name) // Misma categoría
        )
        .slice(0, 8); // Limitar a 8 productos
    }
  }

  // Seleccionar imagen de la galería
  selectImage(image: string): void {
    this.selectedImage = image;
  }

  // Agregar al carrito con alerta mejorada
  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
      this.isInCart = true;
      
      Swal.fire({
        title: '¡Producto agregado!',
        html: `
          <div style="text-align: left; padding: 1rem;">
            <p style="margin-bottom: 1rem;"><strong>${this.product.name}</strong> ha sido agregado a tu carrito.</p>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
              <p style="margin: 0.5rem 0;"><i class="bi bi-tag-fill" style="color: #0d6efd;"></i> <strong>Precio:</strong> ${this.formatPrice(this.product.price)}</p>
              <p style="margin: 0.5rem 0;"><i class="bi bi-geo-alt-fill" style="color: #dc3545;"></i> <strong>Sucursal:</strong> ${this.product.sucursal}</p>
            </div>
            <p style="font-size: 0.9rem; color: #6c757d; margin: 0;">Recuerda: El pago se realiza en efectivo en la sucursal.</p>
          </div>
        `,
        icon: 'success',
        iconColor: '#198754',
        showCancelButton: true,
        confirmButtonText: '<i class="bi bi-cart-check"></i> Ir al carrito',
        cancelButtonText: 'Seguir comprando',
        reverseButtons: true,
        customClass: {
          popup: 'swal-wide',
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-outline-secondary'
        },
        buttonsStyling: false
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/cart']);
        }
      });
    }
  }

  // Volver al home con mejor experiencia
  goBackToHome(): void {
    // Usar history.back() si hay historial, sino ir al home
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }

  // Reservar producto con formulario completo
  reservar(): void {
    if (!this.product) return;

    Swal.fire({
      title: '¿Reservar este producto?',
      html: `
        <div style="text-align: center; padding: 1rem;">
          <p style="font-size: 1rem; color: #495057; margin-bottom: 1.5rem; line-height: 1.6;">
            La reserva tiene una duración de <strong style="color: #0d6efd;">2 días hábiles</strong>.<br>
            Deberás acudir a la sucursal correspondiente para verlo o adquirirlo.<br>
            Si no lo haces, el producto volverá a estar disponible para otros usuarios.
          </p>

          <div style="background: linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.05) 100%); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem;">
              <img src="${this.product.image}" alt="${this.product.name}" 
                   style="width: 80px; height: 80px; object-fit: contain; border-radius: 8px; background: white; padding: 0.5rem;">
              <div style="text-align: left;">
                <h5 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #212529;">${this.product.name}</h5>
                <p style="margin: 0; font-size: 1.5rem; font-weight: bold; color: #198754;">${this.formatPrice(this.product.price)}</p>
              </div>
            </div>
            <p style="margin: 0; font-size: 0.95rem; color: #6c757d;">
              <i class="bi bi-geo-alt-fill" style="color: #dc3545;"></i> <strong>Sucursal:</strong> ${this.product.sucursal}
            </p>
          </div>

          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; border-radius: 4px; text-align: left;">
            <p style="margin: 0; font-size: 0.9rem; color: #856404; line-height: 1.5;">
              <i class="bi bi-info-circle-fill"></i> Al confirmar, recibirás un <strong>código de reserva único</strong> 
              por correo electrónico que deberás presentar en la sucursal.
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      iconColor: '#ffc107',
      width: '550px',
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-check-lg"></i> Sí, reservar por 2 días',
      cancelButtonText: '<i class="bi bi-x-lg"></i> Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'swal-modern',
        confirmButton: 'btn btn-primary btn-lg',
        cancelButton: 'btn btn-outline-secondary btn-lg'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Mostrar formulario de datos
        this.mostrarFormularioReserva();
      }
    });
  }

  // Mostrar formulario de reserva
  private mostrarFormularioReserva(): void {
    if (!this.product) return;

    Swal.fire({
      title: '<i class="bi bi-bookmark-fill"></i> Completa tus datos',
      html: `
        <form id="reservationForm" style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #212529; font-size: 0.95rem;">
              <i class="bi bi-person-fill" style="color: #0d6efd;"></i> Nombre completo *
            </label>
            <input type="text" id="nombre" class="swal2-input" placeholder="Juan Pérez" 
                   style="width: 100%; margin: 0; padding: 0.75rem; font-size: 1rem;">
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #212529; font-size: 0.95rem;">
              <i class="bi bi-card-text" style="color: #0d6efd;"></i> RUT *
            </label>
            <input type="text" id="rut" class="swal2-input" placeholder="12.345.678-9" 
                   style="width: 100%; margin: 0; padding: 0.75rem; font-size: 1rem;">
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #212529; font-size: 0.95rem;">
              <i class="bi bi-envelope-fill" style="color: #0d6efd;"></i> Correo electrónico *
            </label>
            <input type="email" id="email" class="swal2-input" placeholder="ejemplo@correo.com" 
                   style="width: 100%; margin: 0; padding: 0.75rem; font-size: 1rem;">
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #212529; font-size: 0.95rem;">
              <i class="bi bi-telephone-fill" style="color: #0d6efd;"></i> Teléfono *
            </label>
            <input type="tel" id="telefono" class="swal2-input" placeholder="+56 9 1234 5678" 
                   style="width: 100%; margin: 0; padding: 0.75rem; font-size: 1rem;">
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: flex; align-items: center; cursor: pointer; padding: 1rem; background: #f8f9fa; border-radius: 8px; transition: all 0.3s ease;">
              <input type="checkbox" id="representante" style="margin-right: 0.75rem; width: 20px; height: 20px; cursor: pointer;">
              <span style="font-size: 0.95rem; color: #495057; font-weight: 500;">
                <i class="bi bi-people-fill" style="color: #6c757d; margin-right: 0.25rem;"></i>
                Designar a otra persona para retirar
              </span>
            </label>
          </div>

          <div id="representanteFields" style="display: none; background: linear-gradient(135deg, rgba(13, 110, 253, 0.08) 0%, rgba(13, 110, 253, 0.03) 100%); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border: 2px solid rgba(13, 110, 253, 0.2);">
            <p style="margin: 0 0 0.75rem 0; font-size: 0.9rem; color: #495057; font-weight: 600;">
              <i class="bi bi-person-badge"></i> Datos del representante
            </p>
            <div style="margin-bottom: 0.75rem;">
              <input type="text" id="nombreRepresentante" class="swal2-input" placeholder="Nombre completo" 
                     style="width: 100%; margin: 0; padding: 0.75rem; font-size: 0.95rem;">
            </div>
            <div>
              <input type="text" id="rutRepresentante" class="swal2-input" placeholder="RUT" 
                     style="width: 100%; margin: 0; padding: 0.75rem; font-size: 0.95rem;">
            </div>
          </div>

          <div style="background: #e7f3ff; padding: 1rem; border-radius: 8px; border-left: 4px solid #0dcaf0;">
            <p style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #055160; font-weight: 600;">
              <i class="bi bi-envelope-check"></i> Recibirás por email:
            </p>
            <ul style="margin: 0; padding-left: 1.5rem; font-size: 0.85rem; color: #055160;">
              <li>Código de reserva único</li>
              <li>Dirección y horarios de la sucursal</li>
              <li>Recordatorio antes del vencimiento</li>
            </ul>
          </div>
        </form>
      `,
      width: '550px',
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-check-circle-fill"></i> Confirmar Reserva',
      cancelButtonText: '<i class="bi bi-arrow-left"></i> Volver',
      reverseButtons: true,
      customClass: {
        popup: 'swal-modern',
        confirmButton: 'btn btn-success btn-lg',
        cancelButton: 'btn btn-outline-secondary btn-lg'
      },
      buttonsStyling: false,
      didOpen: () => {
        const checkbox = document.getElementById('representante') as HTMLInputElement;
        const fields = document.getElementById('representanteFields');
        
        checkbox?.addEventListener('change', () => {
          if (fields) {
            fields.style.display = checkbox.checked ? 'block' : 'none';
          }
        });
      },
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement)?.value.trim();
        const rut = (document.getElementById('rut') as HTMLInputElement)?.value.trim();
        const email = (document.getElementById('email') as HTMLInputElement)?.value.trim();
        const telefono = (document.getElementById('telefono') as HTMLInputElement)?.value.trim();
        const representanteCheck = (document.getElementById('representante') as HTMLInputElement)?.checked;
        const nombreRepresentante = (document.getElementById('nombreRepresentante') as HTMLInputElement)?.value.trim();
        const rutRepresentante = (document.getElementById('rutRepresentante') as HTMLInputElement)?.value.trim();

        if (!nombre || !rut || !email || !telefono) {
          Swal.showValidationMessage('<i class="bi bi-exclamation-circle"></i> Por favor completa todos los campos obligatorios');
          return false;
        }

        if (representanteCheck && (!nombreRepresentante || !rutRepresentante)) {
          Swal.showValidationMessage('<i class="bi bi-exclamation-circle"></i> Por favor completa los datos del representante');
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.showValidationMessage('<i class="bi bi-exclamation-circle"></i> Por favor ingresa un email válido');
          return false;
        }

        return {
          nombre,
          rut,
          email,
          telefono,
          representante: representanteCheck ? { nombre: nombreRepresentante, rut: rutRepresentante } : null
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.mostrarConfirmacionReserva(result.value);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.reservar();
      }
    });
  }

  // Mostrar confirmación de reserva
  private mostrarConfirmacionReserva(datos: any): void {
    const codigoReserva = this.generarCodigoReserva();
    const fechaVencimiento = this.calcularFechaVencimiento();

    Swal.fire({
      title: '¡Reserva Confirmada!',
      html: `
        <div style="text-align: center;">
          <div style="background: linear-gradient(135deg, #198754 0%, #146c43 100%); padding: 2.5rem 2rem; border-radius: 16px; margin-bottom: 1.5rem; color: white; box-shadow: 0 8px 25px rgba(25, 135, 84, 0.3);">
            <i class="bi bi-check-circle-fill" style="font-size: 4.5rem; margin-bottom: 1rem; display: block;"></i>
            <h4 style="margin: 0 0 1.5rem 0; font-size: 1.3rem; font-weight: 600;">Tu código de reserva</h4>
            <div style="background: rgba(255,255,255,0.25); padding: 1.25rem; border-radius: 12px; margin-bottom: 1rem; backdrop-filter: blur(10px);">
              <p style="font-size: 2.5rem; font-weight: 700; margin: 0; letter-spacing: 5px; font-family: 'Courier New', monospace;">${codigoReserva}</p>
            </div>
            <p style="margin: 0; font-size: 1rem; opacity: 0.95;">Guarda este código para retirar tu producto</p>
          </div>

          <div style="background: #fff3cd; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: left; border: 2px solid #ffc107;">
            <h5 style="margin: 0 0 1rem 0; color: #856404; display: flex; align-items: center; gap: 0.5rem;">
              <i class="bi bi-clock-fill"></i> Detalles de tu reserva
            </h5>
            <div style="display: grid; gap: 0.75rem; font-size: 0.95rem;">
              <p style="margin: 0; color: #856404;">
                <strong><i class="bi bi-calendar-check"></i> Válida hasta:</strong><br>
                <span style="margin-left: 1.5rem;">${fechaVencimiento}</span>
              </p>
              <p style="margin: 0; color: #856404;">
                <strong><i class="bi bi-geo-alt-fill"></i> Sucursal:</strong><br>
                <span style="margin-left: 1.5rem;">${this.product?.sucursal}</span>
              </p>
              <p style="margin: 0; color: #856404;">
                <strong><i class="bi bi-box-seam"></i> Producto:</strong><br>
                <span style="margin-left: 1.5rem;">${this.product?.name}</span>
              </p>
              <p style="margin: 0; color: #856404;">
                <strong><i class="bi bi-cash-stack"></i> Precio:</strong><br>
                <span style="margin-left: 1.5rem; font-size: 1.2rem; font-weight: 600;">${this.formatPrice(this.product?.price || 0)}</span>
              </p>
            </div>
          </div>

          <div style="background: linear-gradient(135deg, rgba(13, 202, 240, 0.15) 0%, rgba(13, 202, 240, 0.05) 100%); padding: 1.5rem; border-radius: 12px; text-align: left; border: 2px solid rgba(13, 202, 240, 0.3);">
            <h5 style="margin: 0 0 1rem 0; color: #055160; display: flex; align-items: center; gap: 0.5rem;">
              <i class="bi bi-list-check"></i> Próximos pasos
            </h5>
            <ol style="margin: 0; padding-left: 1.5rem; color: #055160; line-height: 1.8;">
              <li style="margin-bottom: 0.75rem;">
                Recibirás un <strong>email de confirmación</strong> a:<br>
                <span style="color: #0d6efd; font-weight: 600;">${datos.email}</span>
              </li>
              <li style="margin-bottom: 0.75rem;">Acude a la sucursal con tu código antes del vencimiento</li>
              <li style="margin-bottom: 0.75rem;">Presenta tu código al personal y revisa el producto</li>
              <li>Realiza el pago <strong>en efectivo</strong> si decides comprarlo</li>
            </ol>
          </div>

          <p style="margin-top: 1.5rem; font-size: 0.95rem; color: #6c757d; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
            <i class="bi bi-envelope-paper"></i> Hemos enviado toda la información de tu reserva por correo electrónico
          </p>
        </div>
      `,
      width: '650px',
      icon: 'success',
      iconColor: '#198754',
      confirmButtonText: '<i class="bi bi-house-door-fill"></i> Volver al inicio',
      showCancelButton: true,
      cancelButtonText: '<i class="bi bi-envelope-arrow-up"></i> Reenviar email',
      reverseButtons: true,
      customClass: {
        popup: 'swal-extra-wide',
        confirmButton: 'btn btn-primary btn-lg',
        cancelButton: 'btn btn-outline-secondary btn-lg'
      },
      buttonsStyling: false,
      allowOutsideClick: false
    }).then((finalResult) => {
      if (finalResult.isConfirmed) {
        this.router.navigate(['/']);
      } else if (finalResult.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: '¡Email reenviado!',
          html: `
            <div style="text-align: center; padding: 1rem;">
              <i class="bi bi-envelope-check-fill" style="font-size: 4rem; color: #198754; margin-bottom: 1rem; display: block;"></i>
              <p style="margin: 0; font-size: 1.1rem; color: #495057;">
                Hemos reenviado la confirmación de tu reserva a:<br>
                <strong style="color: #0d6efd;">${datos.email}</strong>
              </p>
            </div>
          `,
          icon: 'success',
          iconColor: '#198754',
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            popup: 'swal-modern'
          }
        });
      }
    });
  }

  // Comprar directamente (ir a la sucursal)
  comprarDirecto(): void {
    if (!this.product) return;

    Swal.fire({
      title: '<i class="bi bi-shop"></i> Compra Presencial',
      html: `
        <div style="text-align: left;">
          <div style="background: linear-gradient(135deg, #198754 0%, #146c43 100%); padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem; color: white; text-align: center;">
            <i class="bi bi-geo-alt-fill" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h4 style="margin: 0 0 0.5rem 0;">${this.product.sucursal}</h4>
            <p style="margin: 0; opacity: 0.9;">Visítanos para adquirir este producto</p>
          </div>

          <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
            <h5 style="margin: 0 0 1rem 0; color: #212529;">
              <i class="bi bi-box-seam"></i> ${this.product.name}
            </h5>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.95rem; color: #6c757d;">Precio:</span>
              <span style="font-size: 1.75rem; font-weight: bold; color: #198754;">${this.formatPrice(this.product.price)}</span>
            </div>
          </div>

          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 1rem; margin-bottom: 1.5rem; border-radius: 4px;">
            <p style="margin: 0 0 0.5rem 0; font-weight: 600; color: #856404;">
              <i class="bi bi-cash-stack"></i> Forma de pago
            </p>
            <p style="margin: 0; font-size: 0.95rem; color: #856404;">
              El pago debe realizarse <strong>en efectivo</strong> en la sucursal.
            </p>
          </div>

          <div style="background: #e7f3ff; padding: 1.5rem; border-radius: 12px;">
            <h5 style="margin: 0 0 1rem 0; color: #0d6efd;">
              <i class="bi bi-clock-fill"></i> Horario de atención
            </h5>
            <p style="margin: 0.5rem 0; color: #495057;">
              <strong>Lunes a Viernes:</strong> 9:00 - 18:00
            </p>
            <p style="margin: 0.5rem 0; color: #495057;">
              <strong>Sábados:</strong> 10:00 - 14:00
            </p>
            <p style="margin: 0.5rem 0; color: #6c757d; font-size: 0.9rem;">
              <i class="bi bi-info-circle"></i> Domingos y festivos cerrado
            </p>
          </div>

          <div style="margin-top: 1.5rem; padding: 1rem; background: #d1ecf1; border-radius: 8px;">
            <p style="margin: 0; font-size: 0.95rem; color: #055160;">
              <i class="bi bi-lightbulb-fill"></i> <strong>Tip:</strong> Puedes reservar el producto para asegurar su disponibilidad antes de visitarnos.
            </p>
          </div>
        </div>
      `,
      width: '600px',
      showCancelButton: true,
      confirmButtonText: '<i class="bi bi-map"></i> Ver mapa',
      cancelButtonText: '<i class="bi bi-bookmark"></i> Reservar primero',
      showDenyButton: true,
      denyButtonText: '<i class="bi bi-telephone"></i> Llamar',
      reverseButtons: true,
      customClass: {
        popup: 'swal-wide',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-success',
        denyButton: 'btn btn-outline-info'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        // Abrir Google Maps
        const direccion = encodeURIComponent(`${this.product?.sucursal}, Chile`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${direccion}`, '_blank');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Ir a reservar
        this.reservar();
      } else if (result.isDenied) {
        // Llamar
        window.location.href = 'tel:8003400222';
      }
    });
  }

  // Métodos auxiliares
  private formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }

  private generarCodigoReserva(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo.match(/.{1,4}/g)?.join('-') || codigo;
  }

  private calcularFechaVencimiento(): string {
    const fecha = new Date();
    // Agregar 2 días hábiles
    let diasAgregados = 0;
    while (diasAgregados < 2) {
      fecha.setDate(fecha.getDate() + 1);
      const diaSemana = fecha.getDay();
      if (diaSemana !== 0 && diaSemana !== 6) { // No es domingo ni sábado
        diasAgregados++;
      }
    }
    return fecha.toLocaleDateString('es-CL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}