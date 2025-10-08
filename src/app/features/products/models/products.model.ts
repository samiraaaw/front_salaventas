export interface Products {
  id: number;
  name: string;
  image: string; // URL completa
  gallery: string[]; // URLs completas
  price: number;
  description: string;
  sucursal: string;
  categoria: string;
  features?: string[];
  condition: string;
  usageDetails: string;
}
