import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
      //image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop',
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

  // Productos mock
  products = [
    {
      id: 1,
      name: 'Chaqueta de Cuero Premium',
      price: 89990,
      oldPrice: 129990,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      categoria: 'Ropa',
      sucursal: 'Santiago Centro',
      discount: 30,
      rating: 4.5,
      isNew: true
    },
    {
      id: 2,
      name: 'Zapatillas Deportivas Running',
      price: 59990,
      oldPrice: 79990,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      categoria: 'Calzado',
      sucursal: 'Providencia',
      discount: 25,
      rating: 4.8,
      isNew: false
    },
    {
      id: 3,
      name: 'Reloj Inteligente Smartwatch',
      price: 129990,
      oldPrice: 179990,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      categoria: 'Electrónica',
      sucursal: 'Las Condes',
      discount: 28,
      rating: 4.6,
      isNew: true
    },
    {
      id: 4,
      name: 'Mochila Ejecutiva Premium',
      price: 45990,
      oldPrice: 65990,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
      categoria: 'Accesorios',
      sucursal: 'Ñuñoa',
      discount: 30,
      rating: 4.3,
      isNew: false
    },
    {
      id: 5,
      name: 'Auriculares Bluetooth Premium',
      price: 79990,
      oldPrice: 99990,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      categoria: 'Electrónica',
      sucursal: 'Maipú',
      discount: 20,
      rating: 4.7,
      isNew: true
    },
    {
      id: 6,
      name: 'Chaqueta Deportiva Impermeable',
      price: 69990,
      oldPrice: 99990,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop',
      categoria: 'Deportes',
      sucursal: 'La Florida',
      discount: 30,
      rating: 4.4,
      isNew: false
    },
    {
      id: 7,
      name: 'Lámpara de Escritorio LED',
      price: 34990,
      oldPrice: 49990,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
      categoria: 'Hogar',
      sucursal: 'Vitacura',
      discount: 30,
      rating: 4.2,
      isNew: false
    },
    {
      id: 8,
      name: 'Bolso de Mano Elegante',
      price: 54990,
      oldPrice: 79990,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
      categoria: 'Accesorios',
      sucursal: 'Santiago Centro',
      discount: 31,
      rating: 4.5,
      isNew: true
    }
  ];

  filteredProducts = [...this.products];
  currentSlide = 0;

  // Filtros
  filters = {
    search: '',
    category: '',
    priceRange: 'all',
    sortBy: 'featured'
  };

  ngOnInit(): void {
    this.startCarousel();
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
    // Por ejemplo, agregar un nuevo filtro o navegar a una sección específica
    if (type === 'economia-circular') {
      // Filtrar productos de economía circular
      this.filters.category = 'Economía Circular';
    } else if (type === 'sala-ventas') {
      // Filtrar productos de sala de ventas
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