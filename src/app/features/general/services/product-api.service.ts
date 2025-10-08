// src/app/shared/services/product-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ProductApi } from '../../products/models/ProductApi.model';


@Injectable({ providedIn: 'root' })
export class ProductApiService {

      //llamado a endpoint con parámetros opcionales.
      private baseUrl = 'http://localhost:5096/api/Prenda';

      constructor(private http: HttpClient) {}


      getProducts(params?: {
            //Filtros-parametros de la petición GET
            sucursalId?: number;
            estPrendaId?:number;
            productoId?: number;
            //comentar los que no se ocupen
            rubroId?: number;
            metalId?: number;
            precioMin?: number;
            precioMax?: number;
            includeFotos?: boolean;
            includeSucursal?: boolean;
            IncludeEstado?:boolean;
            IncludeProducto?:boolean;
            page?: number;
            limit?: number;
        }): Observable<ProductApi[]> {
          let httpParams = new HttpParams();

          if (params) {
            Object.entries(params).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                httpParams = httpParams.set(key, String(value));
              }
            });
          }
          return this.http.get<{ total: number; items: any[] }>(this.baseUrl, { params: httpParams }).pipe(
            map(response =>

              response.items.map(prenda => {
                //obtener URL de la foto, en caso de que la lista de fotos no sea NULA
                const gallery = (prenda.fotos || []).map((f: any) =>
                  `http://localhost:5096${f.fotoUrl}`
                );
                ///luego agregar valores por defecto si no existen.
                const producto: ProductApi = {
                  id: prenda.prendaId,
                  polNumero: prenda.polNumero,

                  productoId: prenda.producto.productoId,
                  productoNombre: prenda.producto.productoNombre,
                  productoActivo: prenda.producto.productoActivo,
                  categoriaId: prenda.producto?.categoria,

                  name: prenda.preDescripcion,
                  price: prenda.prePrecioActual,
                  description: prenda.preObservacion,

                  sucursalId: prenda.sucursal.sucursalId,
                  sucursalNombre: prenda.sucursal.sucursalNombre, 
                  sucursalDireccion: prenda.sucursal.sucursalDireccion, 

                  empId: prenda.empId,

                  estPrendaId: prenda.estPrendaId,
                  estPrendaDescr: prenda.estadoPrenda.estPrendaDescr,
                  estPrendaActivo: prenda.estadoPrenda.estPrendaActivo,

                  metalId: prenda.metalId,
                  condition: prenda.estPrendaId,
                  usageDetails: prenda.prendaUso ?? '',
                  image: gallery[0] || 'assets/images/no-image.jpeg',
                  gallery
                };
                return producto;
              })
            )
          );
      }




    //Prendas de DICREP
    getProductById(id: string): Observable<any> {
      const idNum = +id; // convierte "1" en 1
      return this.getProducts().pipe(
        map(products => products.find((p: { id: number; }) => p.id === idNum))
      );
    }






  
  //Prendas de ChileCompras
  getProductsCL(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5096/ap889i/CLPrenda').pipe(
      map(clprendas => {
        console.log('🛬 Prendas CL recibidas desde la API:', clprendas); // <--- AQUI
        return clprendas.map(clprenda => {
          const gallery = (clprenda.fotos || []).map((f: any) => `http://localhost:5096/api/Foto${f.fotoUrl}`);
          return {
            id: clprenda.clprendaId,
            name: clprenda.clprendaDescr,
            price: clprenda.clprendaValor,
            image: gallery[0] || 'assets/images/no-image.jpg',
            gallery
          };
        });
      })
    );
  }
  
  //Prendas de ChileCompras
  getProductCLById(id: string): Observable<any> {
    const idNum = +id; // convierte "1" en 1
    return this.getProducts().pipe(
      map(products => products.find((p: { id: number; }) => p.id === idNum))
    );
  }

}
