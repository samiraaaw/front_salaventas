import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { ProductsHomeComponent } from '../../../../shared/components/products-home/components/products-home/products-home.component';
import { CarouselComponent } from '../../../../shared/components/carousel/carousel.component';
import { CarouselProductsComponent } from '../../../../shared/components/carousel-products/carousel-products.component';
import { BannerComponent } from '../../../../shared/components/banner/banner.component';

import { Product } from '../../../products/models/product.model';
import { ProductApiService } from '../../../general/services/product-api.service';
import { first, switchMap } from 'rxjs';
import { ProductApi } from '../../../products/models/ProductApi.model';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ProductsHomeComponent,
    CarouselComponent,
    BannerComponent,
    CarouselProductsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit, AfterViewInit {
    
  //Filtros a Utilizar      
      filters = {
        search: '',
        minPrice: null as number | null,
        maxPrice: null as number | null,

        //constantes ocupadas para inicializar los filtros en el ngInit
        sucursal: '',
        estado: '',
        producto: '',

        rubroId: null as number | null,
        metalId: null as number | null,
        productoId: null as number | null,
        estPrendaId: null as number | null
      };

      //Listas que se ocupan para mapear en frontend
      estadosList: {id:number;name:string}[] = []
      sucursalesList: { id: number; name: string }[] = [];
      productosList: {id: number; name:string}[] = [];

      products: ProductApi[] = [];
      filteredProducts: ProductApi[] = [];


      // 3. PROMOCIONES PARA EL BANNER
      promotions = [
        { image: 'assets/images/banners/banner1.jpg', buttonText: 'Ver más', link: '/cart' },
        { image: 'assets/images/banners/banner3.jpg', buttonText: 'Ver más', link: '/cart' },
      ];
      

      // 4. VARIABLES DE PAGINACIÓN
      pageSize = 12;
      currentPage = 1;



      constructor(
        private productApiService : ProductApiService,
        private route: ActivatedRoute,
        private router: Router
      ) {}


      // CICLO DE VIDA - OnInit
      ngOnInit(): void {
        this.route.queryParams.pipe(
          first(),


          //configuracion de PARAMETROS
          switchMap(params => {
            console.log('[🔍 Query Params]', params);  // 🔴 Verifica lo que llega por URL
            
            this.currentPage = +params['page'] || 1;
            // campos de donde se basan los filtros
            this.filters.minPrice = params['minPrice'] ? +params['minPrice'] : null;
            this.filters.maxPrice = params['maxPrice'] ? +params['maxPrice'] : null;

            this.filters.sucursal = params['sucursalId'] ? params['sucursalId'] : '';
            this.filters.estado = params['estPrendaId'] ? params['estPrendaId'] : '';
            this.filters.producto = params['productoId'] ? params['productoId'] : '';

            return this.productApiService.getProducts({
              sucursalId: this.filters.sucursal ? +this.filters.sucursal : undefined,
              estPrendaId:this.filters.estado ? +this.filters.estado : undefined,
              productoId:this.filters.productoId ? +this.filters.producto : undefined,

              precioMin: this.filters.minPrice ?? undefined,
              precioMax: this.filters.maxPrice ?? undefined,
              includeFotos: true,
              includeSucursal: true,
              IncludeEstado: true,
              IncludeProducto: true,
              page: this.currentPage,
              limit: this.pageSize
            });
            
          })
        ).subscribe({
          next: (products: ProductApi[]) => {
            console.log('[✅ Productos recibidos]', products);
            this.filteredProducts = products;

            // Generación de sucursalesList:
            this.sucursalesList = products
              .map(p => ({ id: p.sucursalId, name: p.sucursalNombre }))
              .filter((v, i, a) => a.findIndex(x => x.id === v.id) === i);


            // Generación  de estadosList:
            this.estadosList = products
              .map(p => ({ id: p.estPrendaId, name: p.estPrendaDescr }))
              .filter((v, i, a) => a.findIndex(x => x.id === v.id) === i); 
              

            // Generación  de productosList:
            this.productosList = products
              .map(p => ({ id: p.productoId, name: p.productoNombre }))
              .filter((v, i, a) => a.findIndex(x => x.id === v.id) === i); 



            console.log('[🏪 Sucursales únicas]', this.sucursalesList);
            console.log('[📦 Estados únicos]', this.estadosList);
            console.log('[📦 Productos únicos]', this.productosList);  

              
            //agregar productos
          },
          error: err => console.error(err)
        });


      }


      // CICLO DE VIDA - AfterViewInit
      // Para hacer scroll automático si viene por queryParam
      ngAfterViewInit(): void {
        this.route.queryParams.subscribe(params => {
          if (params['scrollToFilters'] === 'true') {
            this.ensureScrollToFilters();
          }
        });
      }



      // MÉTODOS - SCROLL A FILTROS
      private ensureScrollToFilters(): void {
        this.scrollToFilters();

        setTimeout(() => this.scrollToFilters(), 100);
        setTimeout(() => {
          this.scrollToFilters();
          this.router.navigate(['/'], { queryParams: {}, replaceUrl: true });
        }, 300);
      }

      private scrollToFilters(): void {
        const filtersElement = document.getElementById('filters');
        if (filtersElement) {
          filtersElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }



      //Filtros dentro del método que llama al backend
      applyFilters(): void {
        this.currentPage = 1; // Reinicia paginación cuando los filtros cambian
        const qp: any = {};

        //aca se añaden los filtros que se ocupen y deseen añadir en el HTML.
        if (this.filters.search) qp.search = this.filters.search;
        if (this.filters.minPrice != null) qp.precioMin = this.filters.minPrice;
        if (this.filters.maxPrice != null) qp.precioMax = this.filters.maxPrice;

        if (this.filters.sucursal) qp.sucursalId = this.filters.sucursal;
        if (this.filters.estado) qp.estPrendaId = this.filters.estado;        
        if(this.filters.producto) qp.productoId = this.filters.producto;

        if (this.filters.rubroId != null)    qp.rubroId = this.filters.rubroId;
        if (this.filters.metalId != null)    qp.metalId = this.filters.metalId;
        //if (this.filters.productoId != null) qp.productoId = this.filters.productoId;
        //confirmar si sacar, esta arriba
        //if (this.filters.estPrendaId != null)qp.estPrendaId = this.filters.estPrendaId;


        qp.includeFotos = true;
        qp.includeSucursal = true;
        qp.includeEstado = true;
        qp.IncludeProducto = true;

        qp.page = this.currentPage;
        qp.limit = this.pageSize;

        // Sincroniza URL sin recargar la página
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: qp,
          queryParamsHandling: 'merge',
          replaceUrl: true
        });

        this.productApiService.getProducts(qp).subscribe({
          next: items => this.filteredProducts = items,
          error: err => console.error(err)
        });
      }




      // ==================================================
      // GETTERS - PÁGINA ACTUAL Y TOTAL DE PÁGINAS
      // ==================================================
      /*
      get pagedProducts(): Product[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
      }

      */
      get totalPages(): number {
        return Math.ceil(this.filteredProducts.length / this.pageSize);
      }




      //Gestión de paginación, se vuelve a llamar a getProducts con el  filtro y la página actual.
      goToPage(page: number): void {
        if (page < 1 || page > this.totalPages) return;

        this.currentPage = page;

        const qp: any = {
          page,
          minPrice: this.filters.minPrice ?? null,
          maxPrice: this.filters.maxPrice ?? null,
          sucursalId: this.filters.sucursal || null,
          includeFotos: true,
          includeSucursal: true,
          includeEstado:true,
          includeProducto:true,
          limit: this.pageSize
        };

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: qp,
          queryParamsHandling: 'merge',
          replaceUrl: true
        });

        this.applyFilters();
        this.scrollToFilters();
      }


}
