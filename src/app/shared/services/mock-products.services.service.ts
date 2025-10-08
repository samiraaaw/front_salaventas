// src/app/shared/services/mock-products.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockProductsService {
  
  private mockProducts = [
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
      isNew: true,
      condition: 'Excelente estado',
      usageDetails: 'Usado 3 veces, sin detalles visibles',
      description: 'Elegante chaqueta de cuero genuino en excelente estado. Material de alta calidad, forro interior en perfecto estado. Ideal para ocasiones formales o casuales.',
      gallery: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=80',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&q=60'
      ],
      features: [
        'Cuero genuino de alta calidad',
        'Forro interior intacto',
        'Cremalleras funcionales',
        'Talla L (ajustable)'
      ]
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
      isNew: false,
      condition: 'Buen estado',
      usageDetails: 'Uso moderado, suela en buenas condiciones',
      description: 'Zapatillas deportivas ideales para running. Suela con buena amortiguación, malla transpirable. Perfectas para entrenamientos y uso diario.',
      gallery: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop&q=80'
      ],
      features: [
        'Suela con excelente tracción',
        'Material transpirable',
        'Amortiguación en talón',
        'Talla 42'
      ]
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
      isNew: true,
      condition: 'Como nuevo',
      usageDetails: 'Usado 2 semanas, incluye caja y accesorios',
      description: 'Smartwatch de última generación con múltiples funciones de salud y fitness. Pantalla táctil HD, resistente al agua, batería de larga duración.',
      gallery: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=60'
      ],
      features: [
        'Monitor de frecuencia cardíaca',
        'GPS integrado',
        'Resistente al agua IP68',
        'Batería hasta 7 días',
        'Compatible con iOS y Android'
      ]
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
      isNew: false,
      condition: 'Muy buen estado',
      usageDetails: 'Uso regular, sin rasgaduras ni manchas',
      description: 'Mochila ejecutiva con múltiples compartimentos. Material resistente al agua, diseño ergonómico, ideal para laptop hasta 15.6 pulgadas.',
      gallery: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80'
      ],
      features: [
        'Compartimento para laptop 15.6"',
        'Material resistente al agua',
        'Múltiples bolsillos organizadores',
        'Correas acolchadas',
        'Puerto USB para carga'
      ]
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
      isNew: true,
      condition: 'Excelente estado',
      usageDetails: 'Usado 1 mes, con estuche original',
      description: 'Auriculares bluetooth con cancelación de ruido activa. Sonido de alta fidelidad, batería de larga duración, diseño over-ear confortable.',
      gallery: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=60'
      ],
      features: [
        'Cancelación activa de ruido',
        'Bluetooth 5.0',
        'Batería 30 horas',
        'Almohadillas confortables',
        'Micrófono integrado'
      ]
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
      isNew: false,
      condition: 'Buen estado',
      usageDetails: 'Uso ocasional, material impermeable intacto',
      description: 'Chaqueta deportiva impermeable ideal para actividades outdoor. Material técnico respirable, bolsillos con cierre, capucha ajustable.',
      gallery: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=400&h=400&fit=crop&q=80'
      ],
      features: [
        'Material impermeable',
        'Transpirable',
        'Capucha ajustable',
        'Bolsillos con cierre',
        'Talla M'
      ]
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
      isNew: false,
      condition: 'Muy buen estado',
      usageDetails: 'Funcionamiento perfecto, incluye cargador',
      description: 'Lámpara LED moderna con brazo ajustable. Múltiples niveles de intensidad, bajo consumo energético, diseño minimalista.',
      gallery: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop'
      ],
      features: [
        '5 niveles de intensidad',
        'Brazo flexible',
        'LED de bajo consumo',
        'Base estable',
        'Entrada USB'
      ]
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
      isNew: true,
      condition: 'Como nuevo',
      usageDetails: 'Sin uso, etiquetas originales',
      description: 'Elegante bolso de mano en cuero sintético de alta calidad. Múltiples compartimentos internos, cierre seguro, correa ajustable.',
      gallery: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop&q=80'
      ],
      features: [
        'Cuero sintético premium',
        'Compartimentos organizadores',
        'Cierre magnético',
        'Correa ajustable',
        'Dimensiones: 30x25x10 cm'
      ]
    }
  ];

  constructor() { }

  // Obtener todos los productos
  getProducts(): Observable<any[]> {
    return of(this.mockProducts).pipe(delay(500)); // Simula latencia de red
  }

  // Obtener producto por ID
  getProductById(id: string | number): Observable<any | null> {
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;
    const product = this.mockProducts.find(p => p.id === productId);
    return of(product || null).pipe(delay(500));
  }

  // Obtener productos por categoría
  getProductsByCategory(category: string): Observable<any[]> {
    const filtered = this.mockProducts.filter(p => p.categoria === category);
    return of(filtered).pipe(delay(500));
  }

  // Obtener productos relacionados (misma categoría, excluyendo el actual)
  getRelatedProducts(productId: number, limit: number = 4): Observable<any[]> {
    const currentProduct = this.mockProducts.find(p => p.id === productId);
    if (!currentProduct) {
      return of([]);
    }

    const related = this.mockProducts
      .filter(p => p.id !== productId && p.categoria === currentProduct.categoria)
      .slice(0, limit);
    
    return of(related).pipe(delay(500));
  }
}