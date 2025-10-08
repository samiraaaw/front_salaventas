export interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
    description: string;
    sucursal: string;
    categoria: string;
    features?: string[];
    condition: string; // Nueva propiedad para el estado del producto
    usageDetails: string; // Nueva propiedad para detalles de uso
    gallery: string[]; // Nueva propiedad
  }
  

  