import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MockProductsService } from '../../../../shared/services/mock-products.services.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Datos mock de promociones
  promotions = [
    { 
      image: 'assets/images/banners/banner3.jpg',
      title: 'Rebajas de Temporada',
      subtitle: 'Hasta 50% de descuento en productos seleccionados',
      buttonText: 'Ver ofertas',
      link: '/productos'
    },
    { 
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
      title: 'Nueva Colección',
      subtitle: 'Descubre las últimas tendencias',
      buttonText: 'Explorar',
      link: '/productos'
    }
  ];

  // Categorías destacadas
  categories = [
    { id: 1, name: 'Ropa', icon: '👔', count: 245, image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=300&fit=crop' },
    { id: 2, name: 'Calzado', icon: '👟', count: 128, image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop' },
    { id: 3, name: 'Accesorios', icon: '👜', count: 89, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=300&fit=crop' },
    { id: 4, name: 'Electrónica', icon: '📱', count: 156, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop' },
    { id: 5, name: 'Hogar', icon: '🏠', count: 203, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&h=300&fit=crop' },
    { id: 6, name: 'Deportes', icon: '⚽', count: 167, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=300&fit=crop' }
  ];

  // Productos cargados desde el servicio mock
  products: any[] = [];
  filteredProducts: any[] = [];
  currentSlide = 0;

  // Filtros
  filters = {
    search: '',
    category: '',
    priceRange: 'all',
    sortBy: 'featured'
  };

  constructor(private mockProductsService: MockProductsService) {}

  ngOnInit(): void {
    this.startCarousel();
    this.loadProducts();
  }

  loadProducts(): void {
    this.mockProductsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        console.log('✅ Productos cargados:', products.length);
      },
      error: (err) => {
        console.error('❌ Error al cargar productos:', err);
      }
    });
  }

  startCarousel(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.promotions.length;
    }, 5000);
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(product => {
      const matchSearch = !this.filters.search || 
        product.name.toLowerCase().includes(this.filters.search.toLowerCase());
      
      const matchCategory = !this.filters.category || 
        product.categoria === this.filters.category;
      
      let matchPrice = true;
      if (this.filters.priceRange === 'low') {
        matchPrice = product.price < 50000;
      } else if (this.filters.priceRange === 'medium') {
        matchPrice = product.price >= 50000 && product.price < 100000;
      } else if (this.filters.priceRange === 'high') {
        matchPrice = product.price >= 100000;
      }

      return matchSearch && matchCategory && matchPrice;
    });

    // Ordenar
    if (this.filters.sortBy === 'price-low') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.filters.sortBy === 'price-high') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.filters.sortBy === 'discount') {
      this.filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    }
  }

  clearFilters(): void {
    this.filters = {
      search: '',
      category: '',
      priceRange: 'all',
      sortBy: 'featured'
    };
    this.filteredProducts = [...this.products];
  }

  selectCategory(categoryName: string): void {
    this.filters.category = categoryName;
    this.applyFilters();
    this.scrollToProducts();
  }

  filterByType(type: string): void {
    // Aquí puedes agregar lógica para filtrar por tipo de producto
    if (type === 'economia-circular') {
      this.filters.category = 'Economía Circular';
    } else if (type === 'sala-ventas') {
      this.filters.category = 'Sala de Ventas';
    }
    this.applyFilters();
    this.scrollToProducts();
  }

  scrollToProducts(): void {
    setTimeout(() => {
      const productsSection = document.querySelector('.products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}