export interface ProductApi {
  id: number;
  polNumero: number;
  name: string;
  price: number;
  description?: string;

  sucursalId: number;
  sucursalNombre: string;
  sucursalDireccion?: string;  empId: number;

  estPrendaId: number;
  estPrendaDescr:string;
  estPrendaActivo: boolean;

  metalId: number;



  productoId: number;
  productoNombre: string;
  productoActivo: boolean;
  categoriaId: number;


  usageDetails?: string;
  image: string;

  gallery: string[]; //Lista de los URLs obtenidos de las fotos

  condition: string;

}
